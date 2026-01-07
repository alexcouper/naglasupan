import pytest
from hamcrest import assert_that, equal_to, has_entries, has_length

from apps.projects.models import ProjectStatus
from tests.factories import CompetitionFactory, ProjectFactory


@pytest.mark.django_db
class TestListCompetitions:
    def test_list_competitions_returns_competitions_with_projects(
        self,
        client,
    ) -> None:
        competition = CompetitionFactory()
        project = ProjectFactory(status=ProjectStatus.APPROVED)
        competition.projects.add(project)

        response = client.get("/api/competitions")

        assert_that(response.status_code, equal_to(200))
        assert_that(response.json()["competitions"], has_length(1))
        assert_that(
            response.json()["competitions"][0],
            has_entries(
                id=str(competition.id),
                name=competition.name,
            ),
        )
        assert_that(
            response.json()["competitions"][0]["projects"],
            has_length(1),
        )

    def test_list_competitions_only_includes_approved_projects(
        self,
        client,
    ) -> None:
        competition = CompetitionFactory()
        approved = ProjectFactory(status=ProjectStatus.APPROVED)
        pending = ProjectFactory(status=ProjectStatus.PENDING)
        rejected = ProjectFactory(status=ProjectStatus.REJECTED)
        competition.projects.add(approved, pending, rejected)

        response = client.get("/api/competitions")

        assert_that(response.status_code, equal_to(200))
        assert_that(
            response.json()["competitions"][0]["projects"],
            has_length(1),
        )

    def test_list_competitions_returns_empty_when_no_competitions(
        self,
        client,
    ) -> None:
        response = client.get("/api/competitions")

        assert_that(response.status_code, equal_to(200))
        assert_that(response.json()["competitions"], has_length(0))


@pytest.mark.django_db
class TestGetCompetition:
    def test_get_competition_returns_competition_with_projects(
        self,
        client,
    ) -> None:
        competition = CompetitionFactory()
        project = ProjectFactory(status=ProjectStatus.APPROVED)
        competition.projects.add(project)

        response = client.get(f"/api/competitions/{competition.id}")

        assert_that(response.status_code, equal_to(200))
        assert_that(
            response.json(),
            has_entries(
                id=str(competition.id),
                name=competition.name,
            ),
        )
        assert_that(response.json()["projects"], has_length(1))

    def test_get_nonexistent_competition_returns_404(
        self,
        client,
    ) -> None:
        response = client.get("/api/competitions/00000000-0000-0000-0000-000000000000")

        assert_that(response.status_code, equal_to(404))
