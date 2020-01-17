const express = require('express');
const router = express.Router();
const SendJson = require('../module/SendJson');
const statusCode = require('../module/statusCode');
const { Follow } = require('../models');

//following Toggle
router.post('/following/:user_id', async (req, res) => {
    const follower = req.body.user;
    const following = req.params.user_id;
    try {
        if(follower === following){
            return res.status(statusCode.FORBIDDEN).send(SendJson.successFalse("자기 자신을 팔로잉 할 수 없습니다."));
        }else{
            const isfollowing = await Follow.findOne({where: $AND[{follower: follower}, {following: following}]});
            if(isfollowing){
                await isfollowing.deleteOne();
                return res.status(statusCode.OK).send(SendJson.successTrue("팔로잉 취소", false));
            } else{
                await Follow.create({
                    follower: follower,
                    following : following,
                });
                return res.status(statusCode.OK).send(SendJson.successTrue("팔로잉 성공", true));
            }
        }
    } catch (error) {
        return res.status(statusCode.DB_ERROR).send(Sendjson.successFalse(error));
    }
});

module.exports = router