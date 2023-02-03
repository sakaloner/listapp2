export const setTokenCookie = (token) => {
    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({token: token})
    })
}

export const removeTokenCookie = () => {
    fetch("/api/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    })
}