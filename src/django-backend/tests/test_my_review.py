import pytest
from hamcrest import assert_that, contains_inanyorder, equal_to, has_entries, has_length

from api.auth.jwt import create_access_token
from tests.factories import (
    CompetitionFactory,
    CompetitionReviewerFactory,
    ProjectFactory,
    ProjectRankingFactory,
    UserFactory,
)


@pytest.mark.django_db
class TestListMyReviewCompetitions:
    def test_returns_empty_list_when_not_assigned_to_any_competition(
        self, client, user, auth_headers
    ) -> None:
        CompetitionFactory()  # Competition exists but user not assigned

        response = client.get("/api/my-review/competitions", **auth_headers)

        assert_that(response.status_code, equal_to(200))
        assert_that(response.json(), has_entries(competitions=[]))

    def test_returns_competitions_user_is_assigned_to(
        self, client, user, auth_headers
    ) -> None:
        competition1 = CompetitionFactory(name="Competition A")
        competition2 = CompetitionFactory(name="Competition B")
        CompetitionFactory(name="Competition C")  # Not assigned

        CompetitionReviewerFactory(user=user, competition=competition1)
        CompetitionReviewerFactory(user=user, competition=competition2)

        response = client.get("/api/my-review/competitions", **auth_headers)

        assert_that(response.status_code, equal_to(200))
        competitions = response.json()["competitions"]
        assert_that(competitions, has_length(2))
        names = [c["name"] for c in competitions]
        assert_that(names, contains_inanyorder("Competition A", "Competition B"))

    def test_returns_401_when_not_authenticated(self, client) -> None:
        response = client.get("/api/my-review/competitions")

        assert_that(response.status_code, equal_to(401))


@pytest.mark.django_db
class TestGetMyReviewCompetition:
    def test_returns_404_when_not_assigned_to_competition(
        self, client, user, auth_headers
    ) -> None:
        competition = CompetitionFactory()

        response = client.get(
            f"/api/my-review/competitions/{competition.id}", **auth_headers
        )

        assert_that(response.status_code, equal_to(404))

    def test_cannot_see_projects_from_unassigned_competition(
        self, client, user, auth_headers
    ) -> None:
        # User is assigned to competition1 but not competition2
        project1 = ProjectFactory(title="Project in my competition")
        project2 = ProjectFactory(title="Project in other competition")

        competition1 = CompetitionFactory(name="My Competition", projects=[project1])
        competition2 = CompetitionFactory(
            name="Other Competition", projects=[project2]
        )

        CompetitionReviewerFactory(user=user, competition=competition1)
        # Note: user is NOT assigned to competition2

        # Trying to access competition2 should return 404
        response = client.get(
            f"/api/my-review/competitions/{competition2.id}", **auth_headers
        )

        assert_that(response.status_code, equal_to(404))
        assert_that(response.json(), has_entries(detail="Competition not found"))

    def test_returns_competition_with_projects_when_assigned(
        self, client, user, auth_headers
    ) -> None:
        project1 = ProjectFactory(title="Project A")
        project2 = ProjectFactory(title="Project B")
        competition = CompetitionFactory(projects=[project1, project2])
        CompetitionReviewerFactory(user=user, competition=competition)

        response = client.get(
            f"/api/my-review/competitions/{competition.id}", **auth_headers
        )

        assert_that(response.status_code, equal_to(200))
        data = response.json()
        assert_that(data["name"], equal_to(competition.name))
        assert_that(data["projects"], has_length(2))

    def test_includes_my_rankings_for_projects(
        self, client, user, auth_headers
    ) -> None:
        project1 = ProjectFactory(title="Project A")
        project2 = ProjectFactory(title="Project B")
        competition = CompetitionFactory(projects=[project1, project2])
        CompetitionReviewerFactory(user=user, competition=competition)

        # User has ranked project1 but not project2
        ProjectRankingFactory(
            reviewer=user, competition=competition, project=project1, position=1
        )

        response = client.get(
            f"/api/my-review/competitions/{competition.id}", **auth_headers
        )

        assert_that(response.status_code, equal_to(200))
        projects = response.json()["projects"]

        project1_data = next(p for p in projects if p["id"] == str(project1.id))
        project2_data = next(p for p in projects if p["id"] == str(project2.id))

        assert_that(project1_data["my_ranking"], equal_to(1))
        assert_that(project2_data["my_ranking"], equal_to(None))

    def test_does_not_show_other_reviewers_rankings(self, client, db) -> None:
        reviewer1 = UserFactory()
        reviewer2 = UserFactory()
        project = ProjectFactory()
        competition = CompetitionFactory(projects=[project])

        CompetitionReviewerFactory(user=reviewer1, competition=competition)
        CompetitionReviewerFactory(user=reviewer2, competition=competition)

        # Reviewer2 has ranked the project
        ProjectRankingFactory(
            reviewer=reviewer2, competition=competition, project=project, position=1
        )

        # Reviewer1 requests the competition
        token = create_access_token(reviewer1.id)
        headers = {"HTTP_AUTHORIZATION": f"Bearer {token}"}

        response = client.get(
            f"/api/my-review/competitions/{competition.id}", **headers
        )

        assert_that(response.status_code, equal_to(200))
        projects = response.json()["projects"]

        # Reviewer1 should not see reviewer2's ranking
        assert_that(projects[0]["my_ranking"], equal_to(None))

    def test_returns_401_when_not_authenticated(self, client) -> None:
        competition = CompetitionFactory()

        response = client.get(f"/api/my-review/competitions/{competition.id}")

        assert_that(response.status_code, equal_to(401))
