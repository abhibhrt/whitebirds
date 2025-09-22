const isProd = process.env.NODE_ENV === "production" || false;
export const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};