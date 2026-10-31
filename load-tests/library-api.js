import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500']
  }
};

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:3100';

export default function () {
  const books = http.get(`${BASE_URL}/api/books?status=available`);
  check(books, {
    'lista responde 200': (response) => response.status === 200,
    'respuesta contiene libros': (response) => Array.isArray(response.json())
  });
  const stats = http.get(`${BASE_URL}/api/stats`);
  check(stats, {
    'estadísticas responden 200': (response) => response.status === 200,
    'latencia menor a 500 ms': (response) => response.timings.duration < 500
  });
  sleep(1);
}
