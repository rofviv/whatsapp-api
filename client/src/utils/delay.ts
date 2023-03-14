
export  async function delay(miliseconds: number, func?: Function){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            func && func();
            resolve(true);
        }, miliseconds);
    });
}