import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader(
        'Set-Cookie',
        cookie.serialize("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            expires: new Date(0), //1day
            sameSite: false,
            path: "/"
        })
    );
    res.status(200).json({message: "success"});
}
