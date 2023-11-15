import redis, { busRepo, suggestRepo } from './redis-seed/redis';

const resStream = await redis.xRange('session:712', '-', '+')

const res = await fetch(`http://localhost:8002/trace_route`, 
{ 
    method: 'POST',
    body: JSON.stringify(
        {
            shape: resStream.map(
                (item) => ({ lat: Number(item.message.latitude).toFixed(6), lon: Number(item.message.longitude).toFixed(6) })
            ),
            costing: "bus",
            units: "kilometers"
        }
    )
}).then((data) => data.json())

console.log(res.trip.legs)

// import _ from 'lodash';

// const list = [[13.42968, 52.52327], [13.42956, 52.523261], [13.42948, 52.52326], [13.42944, 52.52326], [13.42906, 52.52325], [13.42855, 52.52324]]

// const res = await fetch(`https://router.project-osrm.org/match/v1/car/${_.join(
//         list.map(
//             (elem) => _.join([Number(elem[0]).toString(), Number(elem[1]).toString()], ',')
//         ),
//         ';'
//     )}?steps=true&geometries=polyline`)
//     .then((data) => data.json())

// console.log(res)

// const res = await fetch('http://localhost:8002/route?json={"locations":[{"lat":13.11869,"lon":77.61308},{"lat":12.97061,"lon":77.71383}],"costing":"bus","units":"miles"}').then((data) => data.json())

// console.log(res.trip.legs[0])


redis.quit();