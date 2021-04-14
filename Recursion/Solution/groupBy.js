/*
 * @Author: YangYuan
 * @Description: 
 * @Date: 2020-12-07 18:47:59
 * @LastEditTime: 2020-12-07 18:59:34
 */

var people = [
  { name: 'Alice', age: 21 },
  { name: 'Max', age: 20 },
  { name: 'Jane' }
];
const map = new Map()
people.map(item => {
    if (item.age && !map.get(item.age)) {
        map.set(item.age, [item])
    } else if (item.age && map.get(item.age)){
      map.set(item.age, map.get(item.age).concat(item))
    } else {
      map.set('other', [item])
    }
    return map
})

console.log(map)