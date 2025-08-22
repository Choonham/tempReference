export const createRequestAction = (type, payload) => {
    let resolve, reject;

    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return {
        type,
        payload,
        promise,
        resolve,
        reject
    };
};