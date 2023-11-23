import { customClients } from '@sih-rtt/dbclient';
import { polyline6Decode } from './polyline6.js';
import { getPolyline } from './getPolyline.js';

const prisma = customClients.prisma;

export {
  polyline6Decode,
  getPolyline,
  prisma
}