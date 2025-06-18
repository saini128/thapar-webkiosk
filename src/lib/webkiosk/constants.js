// WebKiosk URLs and configuration
export const WEBKIOSK_URLS = {
  PERSONAL_INFO: 'https://webkiosk.thapar.edu/StudentFiles/PersonalFiles/StudPersonalInfo.jsp',
  EXAM_MARKS: 'https://webkiosk.thapar.edu/StudentFiles/Exam/StudentEventMarksView.jsp?x=&exam=ALL',
  EXAM_GRADES: 'https://webkiosk.thapar.edu/StudentFiles/Exam/StudentEventGradesView.jsp',
  CGPA_REPORT: 'https://webkiosk.thapar.edu/StudentFiles/Exam/StudCGPAReport.jsp'
};

// Validation keywords for each URL response
export const VALIDATION_KEYWORDS = {
  [WEBKIOSK_URLS.PERSONAL_INFO]: ['Personal Information'], // Add actual keywords here
  [WEBKIOSK_URLS.EXAM_MARKS]: ['Exam Code'], // Add actual keywords here
  [WEBKIOSK_URLS.EXAM_GRADES]: ['Exam Code'], // Add actual keywords here
  [WEBKIOSK_URLS.CGPA_REPORT]: ['Student Name'] // Add actual keywords here
};

// Common error indicators in HTML responses
export const ERROR_INDICATORS = {
  SESSION_TIMEOUT: ['Session Timeout', 'Please Login to continue', 'Login</a> to continue'],
  ACCESS_DENIED: ['Access Denied', 'Unauthorized', 'Permission Denied'],
  SERVER_ERROR: ['Internal Server Error', 'Service Unavailable', 'Database Error'],
  INVALID_REQUEST: ['Invalid Request', 'Bad Request', 'Malformed Request']
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000; // 30 seconds

export const REQUEST_HEADERS = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
  'Referer': 'https://webkiosk.thapar.edu/CommonFiles/UserAction.jsp',
  'Host': 'webkiosk.thapar.edu',
  'Content-Type':'application/x-www-form-urlencoded',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-User': '?1',
  'Sec-Ch-Ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Linux"',
};

export const SEMORDER= ['2223ODDSEM','AUXFEB23','2223EVESEM', 
  '2324SUMMER', 'AUXAUG23','AUXAUX23','2324ODDSEM','AUXFEB24','2324EVESEM',
   '2425SUMMER', 'AUXAUG24','AUXAUG24','2425ODDSEM','AUXFEB25','2425EVESEM', '2526SUMMER',
   'AUXAUG25','AUXAUX25','2526ODDSEM','AUXFEB26','2526EVESEM', '2627SUMMER','AUXAUG26','AUXAUX26'
   ,'2627ODDSEM','AUXFEB27','2627EVESEM', '2728SUMMER',];