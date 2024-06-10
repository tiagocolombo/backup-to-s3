# Backup to S3 Action

A GitHub Action to back up a repository to AWS S3.

## Inputs

| Input                 | Description                      | Required |
|-----------------------|----------------------------------|----------|
| `s3-bucket`           | The name of the S3 bucket        | true     |
| `aws-access-key-id`   | AWS Access Key ID                | true     |
| `aws-secret-access-key` | AWS Secret Access Key            | true     |
| `aws-region`          | AWS Region                       | true     |

## Example Usage

```yaml
name: Backup to S3

on:
  push:
    branches:
      - main

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Backup repository to S3
        uses: YOUR_USERNAME/YOUR_REPOSITORY@v1
        with:
          s3-bucket: 'your-s3-bucket-name'
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: 'your-aws-region'
