export interface CampusSettings {
  keyCloak: {
    credentials: {
      secret: string;
    };
    realm: string;
    'auth-server-url': string;
    'ef-server-url': string;
    'ssl-required': string;
    resource: string;
    'verify-token-audience': boolean;
    'use-resource-role-mappings': boolean;
    'confidential-port': number;
    CLIENT_ID: string;
    CLIENT_DB_ID: string;
    GRANT_TYPE: string;
    GRANT_TYPE_PAT: string;
    USERNAME_ADMIN: string;
    PASSWORD_ADMIN: string;
    SCOPE_NAME: string;
    'bearer-only': boolean;
    FINESSE_URL: string;
    TWILIO_SID: string;
    TWILIO_VERIFY_SID: string;
    TWILIO_AUTH_TOKEN: string;
  };
  redis: {
    userName: string;
    password: string;
  };
  mongo: {
    userName: string;
    password: string;
  };
   campaigns: {
    url: string;
    username: string;
    password: string;
  };
   surveys: {
    url: string;
    username: string;
    password: string;
  };

  finesse: {
    url: string;
    adminUser: string;
    adminPass: string;
  };

  dialer: {
    serviceIdentifier: string;
    maxConcurrentCalls: string;
    maxCallTime: string;
    callsPerSecond: string;
  };

  secureLink: {
    linkExpiryTime: number;
  };

  domain: string;
  subDomain: string;
  locale: string;
  timeZone: string;
}

export interface Standard {
  _id: string;
  CampusName: string;
  CampusCode: string;
  CampusId:string
  CampusSettings: CampusSettings;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
