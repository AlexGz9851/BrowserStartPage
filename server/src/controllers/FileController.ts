import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import AWS from 'aws-sdk'
import { Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { getSettings, updateSettings } from '../models/SettingsModel';

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename (req, file, cb) {
      cb(null, file.originalname);
    }
  })
});
const s3 = new AWS.S3();

@Controller('filemanager')
class FileController {

  bucketName = process.env.AWS_BUCKET_NAME!;

  @Get(':id')
  private async get(req: Request, res: Response) {
    const getParams = {
      Bucket: this.bucketName,
      Key: req.params.id
    };

    s3.getObject(getParams).promise()
      .then(data => {
        res.send(data.Body);
      })
      .catch(err => {
        res.status(400).send({ success: false, err });
      })
  }

  @Post()
  @Middleware(upload.single('image'))
  private async post(req: Request, res: Response) {
    if (!req.user) {
      res.status(401).send();
    }
    const source = req.file.path;
    const targetName = uuidv4() + '.' + req.file.path.split('.').pop();
    const readFilePromise = promisify(fs.readFile)
    const unlinkFilePromise = promisify(fs.unlink)

    readFilePromise(source)
      .then(buffer => {
        const putParams = {
          Bucket: this.bucketName,
          Key: targetName,
          Body: buffer
        };
        return s3.putObject(putParams).promise()
      })
      .then(async (data) => {
        const currentSettings = await getSettings(req);
        currentSettings.backgroundImage = targetName;
        return updateSettings(req, currentSettings);
      })
      .then(() => {
        res.send({ success: true, id: targetName });
        return unlinkFilePromise(source);
      })
      .catch(err => {
        Logger.Err(`Unexpected error: ${err}`)
        res.status(500).send({ success: false });
      })
  }

}

export default FileController;