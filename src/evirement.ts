export const environment = {
  apiUrl: 'https://xn--o1ab.xn--80akonecy.xn--p1ai/api',
  apiUrlSpecifications: 'https://xn--o1ab.xn--80akonecy.xn--p1ai/apiSpecifications',
  apiUrlMonitoring: 'https://xn--o1ab.xn--80akonecy.xn--p1ai/monitoring',
  apiUrlTg: 'https://xn--o1ab.xn--80akonecy.xn--p1ai/tg',
  apiGeneralTg: 'https://xn--o1ab.xn--80akonecy.xn--p1ai/tgGeneralStatApi',
  apiUrlHR: 'https://xn--o1ab.xn--80akonecy.xn--p1ai/hr',
  apiUrlManager: 'https://xn--o1ab.xn--80akonecy.xn--p1ai/manager',
  //apiUrlManager: 'http://localhost:8022',
  apiUrlDrivers: 'https://xn--o1ab.xn--80akonecy.xn--p1ai/drivers',
  apiAuthHubUrl: 'https://xn--o1ab.xn--80akonecy.xn--p1ai/auth',
  // apiAuthHubUrl: 'http://localhost:5011',
  apiLogisticsUrl: 'https://xn--o1ab.xn--80akonecy.xn--p1ai/logistics',
  // apiLogisticsUrl: 'http://localhost:8072',
  // apiUrlShops: 'https://localhost:5311',
    apiUrlShops: 'https://xn--o1ab.xn--80akonecy.xn--p1ai/shops',
};


export const localStorageEnvironment = {
  user_id: {
    key: 'p_VXNlcklk', // user id
    ttl: 600000,
  },
  authToken: {
    key: 'p_YXV0aFRva2Vu', // user token
    ttl: 600000,
  },
};

export const sessionStorageEnvironment = {
  user_id: {
    key: 'p_VXNlcklk', // user id
    ttl: 600000,
  },
  authToken: {
    key: 'p_YXV0aFRva2Vu', // user token
    ttl: 600000,
  },
};

export const memoryCacheEnvironment = {
  baskets: {
    key: 'pkt_baskets',
    ttl: 60000,
  },
  user: {
    key: 'pkt_user',
    ttl: 600,
  },
};
