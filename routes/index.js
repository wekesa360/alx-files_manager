import AppController from '../controllers/AppController';
import UseController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controller/FilesController';

const express = require('express');

function router(app) {
    const route = express.Router();
    app.use('/', route);
  
    route.get('/status', (req,res) => {
      AppController.getStatus(req,res);
    });
  
    route.get('/stats', (req,res) => {
      AppController.getStats(req,res);
    });
  
    route.post('/users', (req,res) => {
      UsersController.postNew(req,res);
    });
  
    route.get('/connect', (req,res) => {
      AuthController.getConnect(req,res);
    });
  
    route.get('/disconnect', (req,res) => {
      AuthController.getDisconnect(req,res);
    });
  
    route.get('/users/me', (req,res) => {
      UsersController.getMe(req,res);
    });
  
    route.post('/files', (req,res) => {
      FilesController.postUpload(req,res);
    });
  }
  
  export default router;