import _ from 'lodash';
import { polyline6Decode } from './polyline6.js';
import { prisma } from './index.js';

export const getPolyline = async (busStopMembers: any[], busStops: any[]) => {
  var polyline: string;

  const filteredBusStops: Record<string, any>[] = []

  for (let i = 0; i < busStopMembers.length; i++) {
    filteredBusStops.push(busStops.find((busStop) => busStop.id === busStopMembers[i].ref));
  }

  try {
    const res: any = await fetch('http://localhost:8002/trace_route', {
      method: 'POST',
      body: JSON.stringify({
        shape: filteredBusStops.map((busStop: Record<string, any>) => ({ lat: busStop.lat, lon: busStop.lon })),
        costing: "bus",
        units: 'kilometers'
      })
    }).then((data) => data.json())

    const shapes = res.trip?.legs?.map((leg: any) => leg.shape)
    const decodedPolyline6 = polyline6Decode(_.join(shapes, ''));

    const encodedPolyline: any[] = await prisma.$queryRaw`
      SELECT ST_AsEncodedPolyline(
        ST_GeomFromText(
          'LINESTRING(' || ${_.join(decodedPolyline6.map((decodeMembers: any) => _.join(decodeMembers.reverse(), ' ')), ',')} || ')',
          4326
        )::geometry
      ) as polyline
    `;

    polyline = encodedPolyline[0].polyline;

  } catch (e) {
    const res: any = await fetch(`https://router.project-osrm.org/match/v1/car/${_.join(
      filteredBusStops.map((busStop) => _.join(
        [
          busStop.lon,
          busStop.lat
        ],
        ','
      )
      ),
      ';'
    )
      }?steps=true`)
      .then((data) => data.json());

    if (res.matchings)
      polyline = res.matchings?.reduce((
        max: Record<string, any>,
        obj: Record<string, any>) =>
        (obj.confidence > max.confidence ? obj : max), res.matchings[0])
        .geometry
    else
      polyline = 'undefined';
  }

  return polyline;
}