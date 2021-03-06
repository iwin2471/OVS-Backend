var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    var id = req.body.id;
    var board_list = [];

    Tour.findOne({id: id}, function(err, tour) {
        if (err) return res.status(409).send("DB err");
        if (tour) {
            Board.find({}, function(err, board) {
                if (err) return res.status(409).send("DB error");
                if (board) {
                    for (var i = 0; i < tour.board_ids.length; i++) {
                        for (var j = 0; j < board.length; j++) {
                            if (tour.board_ids[i] == board[j].boardid) {
                                board_list.push(board[j]);
                            }
                        }
                    }


                    if (tour.phoneNum != undefined) {
                      if (tour.info != undefined) {
                        return res.status(200).json({
                            id: tour.id,
                            img_url: tour.img_url,
                            name: tour.name,
                            name_eng: tour.name_eng,
                            info: tour.info,
                            tag: tour.tag,
                            adress: tour.adress,
                            phoneNum: tour.phoneNum,
                            board_ids: board_list,
                            info: tour.info,
                            like: tour.like
                        });
                      }else{
                        return res.status(200).json({
                            id: tour.id,
                            img_url: tour.img_url,
                            name: tour.name,
                            name_eng: tour.name_eng,
                            tag: tour.tag,
                            adress: tour.adress,
                            phoneNum: tour.phoneNum,
                            board_ids: board_list,
                            info: tour.info,
                            like: tour.like,
                            info: "정보가없습니다"
                        });
                      }
                    } else {
                      if (tour.info != undefined) {
                        return res.status(200).json({
                            id: tour.id,
                            img_url: tour.img_url,
                            name: tour.name,
                            name_eng: tour.name_eng,
                            info: tour.info,
                            tag: tour.tag,
                            adress: tour.adress,
                            phoneNum: null,
                            board_ids: board_list,
                            info: tour.info,
                            like: tour.like
                        });
                      }else{
                        return res.status(200).json({
                            id: tour.id,
                            img_url: tour.img_url,
                            name: tour.name,
                            name_eng: tour.name_eng,
                            tag: tour.tag,
                            adress: tour.adress,
                            phoneNum: null,
                            board_ids: board_list,
                            info: tour.info,
                            like: tour.like,
                            info: "정보가없습니다"
                        });
                      }
                    }
                }
            });
        } else return res.status(401).send("not found");
    });
});

router.post('/like', function(req, res, next) {
    var id = req.body.id;
    var token = req.body.token;
    var isLiked = false;

    Users.findOne({token: token}, function(err, users) {
        if (err) return res.status(409).send("DB err");
        if (users) {
          for (var i = 0; i < users.favorit.length; i++) {
            if (users.favorit[i] === id){
              console.log("asdf");
              isLiked = true;
              break;
            }
          }

          if(isLiked){
            return res.status(417).send("already liked")
          }else{
            Tour.findOne({id: id}, function(err, tour) {
                if (err) return res.status(409).send("DB err");
                if (tour) {
                    Users.update({token: token}, {$push: {favorit: id}}, function(err, result) {
                        Tour.update({id: id}, {$set: {like: ++tour.like}}, function(err, tour) {
                            if (err) return res.status(409).send("DB error");
                            if (tour) return res.status(200).send("su");
                        });
                    });
                }
            });
          }

        } else return res.status(412).send("user not found token param error");
    });
});


router.post('/dislike', function(req, res, next) {
    var id = req.body.id;
    var token = req.body.token;

    Users.findOne({token: token}, function(err, users) {
        if (err) return res.status(409).send("DB err");
        if (users) {
            Tour.findOne({id: id}, function(err, tour) {
                if (err) return res.status(409).send("DB err");
                if (tour) {
                    Users.update({token: token}, {$pop: {favorit: id}}, function(err, result) {
                        Tour.update({id: id}, {$set: {like: --tour.like}}, function(err, tour) {
                            if (err) return res.status(409).send("DB error");
                            if (tour) return res.status(200).send("su");
                        });
                    });
                }
            });
        } else return res.status(412).send("user not found token param error");
    });
});

module.exports = router;
