import { busRepo } from "./redis-seed/redis";

const bus = await busRepo.fetch('sad')

const sym = Object.getOwnPropertySymbols(bus).find(
    (s) => s.description === "entiryId"
);

// console.log(bus[Object.getOwnPropertySymbols(bus)[1]]);