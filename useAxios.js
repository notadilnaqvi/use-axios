import axios from "axios";
import { useState, useEffect } from "react";

function useAxios(url, cfg, deps) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);

        const source = axios.CancelToken.source();
        const cancelToken = source.token;

        axios(url, { cancelToken, ...cfg })
            .then((res) => {
                setData(res.data);
                setLoading(false);
                setError(false);
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    setData({});
                    setLoading(true);
                    setError(false);
                    console.log("Cancelling previous request...");
                } else {
                    setData({});
                    setLoading(false);
                    setError(true);
                    console.log(`Error fetching data from '${url}'\n`, err);
                }
            });

        return () => {
            source.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { data, loading, error };
}

export default useAxios;
