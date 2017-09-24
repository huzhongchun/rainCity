/**
 * Created by huzhongchun on 2017/9/24.
 */
export function getHash(){
    const str = window.location.hash;
    if(str.length === 0) {
        return {
            current: 0,
            query: null
        }
    } else {
        if(str[1] == '4') {
            return {
                current: 4,
                query: str.slice(2) || -1,
            }
        } else {
            return {
                current: str[1],
                query: null,
            }
        }
    }
}