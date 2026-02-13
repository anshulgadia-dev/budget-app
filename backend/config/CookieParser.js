const customCookieParser = (cookie) => {
    let ans = cookie.split(";").reduce((acc , el) => {
        const arr = el.split("=");
        const key = arr[0].trim();
        const val = arr[1].trim();
        acc[key] = val;

        return acc;
    } , {})

    return ans;
}

export default customCookieParser;