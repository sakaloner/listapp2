import cookie from 'cookie';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req,  res) {
    const { method } = req;
    switch (method) {
        case 'GET':
            try {
                const cookies = cookie.parse(req.headers.cookie || "");
                if (cookies.Authorization) {
                    res.status(200).json({ cookie: cookies.Authorization });
                } else {
                    res.status(200).json({ cookie: null});
                }
            } catch (error) {
                res.status(400).json({ cookie: null});
            }
            break;
        default:
            res.status(400).json({ cookie: null });
            break;
    }
}
