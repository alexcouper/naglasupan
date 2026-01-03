import factory
from django.contrib.auth import get_user_model
from apps.projects.models import Project, ProjectStatus
from apps.tags.models import Tag

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    kennitala = factory.Sequence(lambda n: f"{n:010d}")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    is_verified = True
    is_active = True

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        password = kwargs.pop("password", "testpassword123")
        user = super()._create(model_class, *args, **kwargs)
        user.set_password(password)
        user.save()
        return user


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tag

    name = factory.Sequence(lambda n: f"Tag {n}")
    slug = factory.Sequence(lambda n: f"tag-{n}")
    description = factory.Faker("sentence")
    color = "#FF5733"


class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Project

    title = factory.Faker("company")
    description = factory.Faker("paragraph")
    website_url = factory.Faker("url")
    owner = factory.SubFactory(UserFactory)
    status = ProjectStatus.PENDING
    submission_month = factory.LazyFunction(lambda: "2025-01")

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create or not extracted:
            return
        self.tags.add(*extracted)
