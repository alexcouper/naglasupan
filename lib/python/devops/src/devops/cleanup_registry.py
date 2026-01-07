"""Clean up old container registry images, keeping the N most recent tags per image."""

import argparse
import os

from scaleway import Client
from scaleway.registry.v1 import RegistryV1API


def main() -> None:
    parser = argparse.ArgumentParser(description="Clean up old registry image tags")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be deleted without deleting",
    )
    parser.add_argument(
        "--keep",
        type=int,
        default=5,
        help="Number of tags to keep per image (default: 5)",
    )
    parser.add_argument(
        "--profile",
        default=os.environ.get("SCW_PROFILE"),
        help="Scaleway config profile to use",
    )
    parser.add_argument(
        "--region",
        default="fr-par",
        help="Region (default: fr-par)",
    )
    args = parser.parse_args()

    client = Client.from_config_file_and_env(profile_name=args.profile)
    api = RegistryV1API(client)

    keep = args.keep
    if args.dry_run:
        print(f"=== DRY RUN: Showing what would be deleted (keeping {keep}) ===")
    else:
        print(f"=== Cleaning up old registry images (keeping {keep}) ===")

    images = api.list_images_all(region=args.region, order_by="created_at_desc")

    for image in images:
        print(f"Processing image: {image.name}")

        tags = api.list_tags_all(
            image_id=image.id, region=args.region, order_by="created_at_desc"
        )
        tag_count = len(tags)

        if tag_count > keep:
            delete_count = tag_count - keep
            print(f"  Found {tag_count} tags, will delete oldest {delete_count}")

            for tag in tags[keep:]:
                created_at = tag.created_at
                created = created_at.strftime("%Y-%m-%d %H:%M") if created_at else "?"
                if args.dry_run:
                    print(f"  [DRY RUN] Would delete: {tag.name} (created {created})")
                else:
                    print(f"  Deleting: {tag.name} (created {created})")
                    api.delete_tag(tag_id=tag.id, region=args.region)
        else:
            print(f"  Only {tag_count} tags, nothing to delete")

    if args.dry_run:
        print("=== DRY RUN complete (no changes made) ===")
    else:
        print("=== Registry cleanup complete ===")


if __name__ == "__main__":
    main()
