export const HttpStatusCode = {
  Continue: 100,
  100: 'Continue',

  SwitchingProtocols: 101,
  101: 'SwitchingProtocols',

  Processing: 102,
  102: 'Processing',

  EarlyHints: 103,
  103: 'EarlyHints',

  Ok: 200,
  200: 'Ok',

  Created: 201,
  201: 'Created',

  Accepted: 202,
  202: 'Accepted',

  NonAuthoritativeInformation: 203,
  203: 'NonAuthoritativeInformation',

  NoContent: 204,
  204: 'NoContent',

  ResetContent: 205,
  205: 'ResetContent',

  PartialContent: 206,
  206: 'PartialContent',

  MultiStatus: 207,
  207: 'MultiStatus',

  AlreadyReported: 208,
  208: 'AlreadyReported',

  ImUsed: 226,
  226: 'ImUsed',

  MultipleChoices: 300,
  300: 'MultipleChoices',

  MovedPermanently: 301,
  301: 'MovedPermanently',

  Found: 302,
  302: 'Found',

  SeeOther: 303,
  303: 'SeeOther',

  NotModified: 304,
  304: 'NotModified',

  UseProxy: 305,
  305: 'UseProxy',

  Unused: 306,
  306: 'Unused',

  TemporaryRedirect: 307,
  307: 'TemporaryRedirect',

  PermanentRedirect: 308,
  308: 'PermanentRedirect',

  BadRequest: 400,
  400: 'BadRequest',

  Unauthorized: 401,
  401: 'Unauthorized',

  PaymentRequired: 402,
  402: 'PaymentRequired',

  Forbidden: 403,
  403: 'Forbidden',

  NotFound: 404,
  404: 'NotFound',

  MethodNotAllowed: 405,
  405: 'MethodNotAllowed',

  NotAcceptable: 406,
  406: 'NotAcceptable',

  ProxyAuthenticationRequired: 407,
  407: 'ProxyAuthenticationRequired',

  RequestTimeout: 408,
  408: 'RequestTimeout',

  Conflict: 409,
  409: 'Conflict',

  Gone: 410,
  410: 'Gone',

  LengthRequired: 411,
  411: 'LengthRequired',

  PreconditionFailed: 412,
  412: 'PreconditionFailed',

  PayloadTooLarge: 413,
  413: 'PayloadTooLarge',

  UriTooLong: 414,
  414: 'UriTooLong',

  UnsupportedMediaType: 415,
  415: 'UnsupportedMediaType',

  RangeNotSatisfiable: 416,
  416: 'RangeNotSatisfiable',

  ExpectationFailed: 417,
  417: 'ExpectationFailed',

  ImATeapot: 418,
  418: 'ImATeapot',

  MisdirectedRequest: 421,
  421: 'MisdirectedRequest',

  UnprocessableEntity: 422,
  422: 'UnprocessableEntity',

  Locked: 423,
  423: 'Locked',

  FailedDependency: 424,
  424: 'FailedDependency',

  TooEarly: 425,
  425: 'TooEarly',

  UpgradeRequired: 426,
  426: 'UpgradeRequired',

  PreconditionRequired: 428,
  428: 'PreconditionRequired',

  TooManyRequests: 429,
  429: 'TooManyRequests',

  RequestHeaderFieldsTooLarge: 431,
  431: 'RequestHeaderFieldsTooLarge',

  UnavailableForLegalReasons: 451,
  451: 'UnavailableForLegalReasons',

  InternalServerError: 500,
  500: 'InternalServerError',

  NotImplemented: 501,
  501: 'NotImplemented',

  BadGateway: 502,
  502: 'BadGateway',

  ServiceUnavailable: 503,
  503: 'ServiceUnavailable',

  GatewayTimeout: 504,
  504: 'GatewayTimeout',

  HttpVersionNotSupported: 505,
  505: 'HttpVersionNotSupported',

  VariantAlsoNegotiates: 506,
  506: 'VariantAlsoNegotiates',

  InsufficientStorage: 507,
  507: 'InsufficientStorage',

  LoopDetected: 508,
  508: 'LoopDetected',

  NotExtended: 510,
  510: 'NotExtended',

  NetworkAuthenticationRequired: 511,
  511: 'NetworkAuthenticationRequired',
} as const;
