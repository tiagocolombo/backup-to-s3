import * as core from '@actions/core';
import * as github from '@actions/github';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import archiver from 'archiver';

async function run() {
  try {
    const s3Bucket = core.getInput('s3-bucket', { required: true });
    const s3AccessKeyId = core.getInput('aws-access-key-id', { required: true });
    const s3SecretAccessKey = core.getInput('aws-secret-access-key', { required: true });
    const s3Region = core.getInput('aws-region', { required: true });

    const repository = github.context.repo.repo;
    const owner = github.context.repo.owner;
    const ref = github.context.ref.replace('refs/heads/', '');
    const timestamp = new Date().toISOString().replace(/[:\-]/g, '').replace(/\..+/, '');
    const archivePath = `${repository}-${ref}-${timestamp}.zip`;

    // Create a file to stream archive data to.
    const output = fs.createWriteStream(archivePath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', async () => {
      const s3 = new S3Client({
        region: s3Region,
        credentials: {
          accessKeyId: s3AccessKeyId,
          secretAccessKey: s3SecretAccessKey
        }
      });

      const fileContent = fs.readFileSync(archivePath);

      const params = {
        Bucket: s3Bucket,
        Key: `${repository}/${archivePath}`,
        Body: fileContent
      };

      try {
        await s3.send(new PutObjectCommand(params));
        core.info('Backup successful');
      } catch (err: any) {
        core.setFailed(`Backup failed: ${err.message}`);
      }
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    archive.directory('.', false);

    await archive.finalize();
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
