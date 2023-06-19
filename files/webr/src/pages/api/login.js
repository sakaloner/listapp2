import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default (req, res) => {
    res.setHeader(
        'Set-Cookie',
        cookie.serialize("Authorization", req.body.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60*60*24, //1day
            sameSite: false,
            path: "/"
        })
    );
    res.status(200).json({message: "success"});
}
