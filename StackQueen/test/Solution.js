/**
 * @desc 括号匹配
 */
export default class Solution {
    isValid(str) {
        const isValid = function (str) {
            let stack = [];
            for (let i = 0; i < str.length; i++) {
                // 正向匹配
                switch(str[i]) {
                    case '(':
                    case '[':
                    case '{':
                        stack.push(str[i]);
                        break;
                    default:
                        break;
                }
                // 反向匹配
                switch(str[i]) {
                    case ')':
                        if (stack.length === 0 || stack.pop() !== '(') {    
                            console.error(`${stack}-${str[i]}`, 'validate error.in');
                            return false;
                        }
                        break;
                    case ']':   
                        if (stack.length === 0 || stack.pop() !== '[') {
                            console.error(`${stack}-${str[i]}`, 'validate error.in');
                            return false;
                        }
                        break;
                    case '}':
                        if (stack.length === 0 || stack.pop() !== '{') {
                            console.error(`${stack}-${str[i]}`, 'validate error.in');
                            return false;
                        }
                        break;
                    default:
                        break;
                }
            }
            // 是否完成匹配
            if (stack.length === 0) {
                return true;
            } else {
                console.error(str, 'validate error.out');
                return false;
            }
        }
        return isValid(str);
    }
}
