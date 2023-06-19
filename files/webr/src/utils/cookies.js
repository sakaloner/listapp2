export const setTokenCookie = (token) => {
    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({token: token})
    })
}

export const removeTokenCookie = async () => {
    fetch("/api/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    })
}

export const getToken = async () =>  {
    const res = 
        await fetch("/api/cookies", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
    return res
  }