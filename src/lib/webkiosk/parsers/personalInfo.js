import { load } from 'cheerio';

export function parsePersonalInfo(htmlContent) {
  htmlContent = htmlContent
    .replace(/[\n\r]/g, '')         // Remove all newline and carriage return characters
    .replace(/\s{2,}/g, ' ');
  const $ = load(htmlContent);

  const result = {
    parsed: true,
    data: {},
    error: null
  };

  try {
    const infoMap = {};
    const table = $('table').first();
    const rows = table.find('tr');

    let stopParsing = false;

    rows.each((_, row) => {
      if (stopParsing) return;

      const cells = $(row).find('td');

      // Stop parsing before Mentor section
      if (cells.text().toLowerCase().includes('mentor')) {
        stopParsing = true;
        return;
      }

      if (cells.length >= 2) {
        const label = $(cells[0]).text().trim().replace(/\u00a0/g, ' ').replace(/[\s:]+$/, '');
        const value = $(cells[1]).text().trim().replace(/\u00a0/g, ' ');
        if (label) infoMap[label.toLowerCase()] ??= value;
      }

      // Handle student & parent contact columns
      if (cells.length >= 4) {
        const label1 = $(cells[0]).text().trim().replace(/\u00a0/g, ' ').replace(/[\s:]+$/, '');
        const value1 = $(cells[1]).text().trim().replace(/\u00a0/g, ' ');
        const label2 = $(cells[2]).text().trim().replace(/\u00a0/g, ' ').replace(/[\s:]+$/, '');
        const value2 = $(cells[3]).text().trim().replace(/\u00a0/g, ' ');

        if (label1) infoMap[`student_${label1.toLowerCase()}`] ??= value1;
        if (label2) infoMap[`parent_${label2.toLowerCase()}`] ??= value2;
      }
    });

    result.data = {
      name: infoMap['name'],
      enrollmentNo: infoMap['enrollment no.'],
      fatherName: infoMap["father's name"],
      motherName: infoMap["mother's name"],
      dob: infoMap['date of birth no.'],
      course: (infoMap['course'] || '').replace(/\(.*?\)/, '').trim() + (infoMap['course']?.match(/\((.*?)\)/) || [])[1] || '',

      semester: infoMap['semester'],

      contact: {
        student: {
          mobile: infoMap['student_cell/mobile'],
          telephone: infoMap['student_telephone'],
          email: (infoMap['student_e-mail'] || '').split(';').map(e => e.trim()).filter(e => e),
        },
        parent: {
          mobile: infoMap['parent_cell/mobile'],
          telephone: infoMap['parent_telephone'],
          email: infoMap['parent_e-mail'],
        }
      },

      lms: {
        login: infoMap['lms login name']
      },

      address: {
        correspondence: {
          address: extractAddressBlock($, 'correspondence'),
        },
        permanent: {
          address: extractAddressBlock($, 'permanent'),
        }
      }
    };

    return result;
  } catch (err) {
    return {
      parsed: false,
      data: null,
      error: err.message
    };
  }
}

/**
 * Extract address block by heading name (correspondence or permanent)
 * @param {*} $ - cheerio instance
 * @param {string} type - either 'correspondence' or 'permanent'
 */
function extractAddressBlock($, type) {
  const heading = $(`strong:contains("${type === 'correspondence' ? 'Correspondence Address' : 'Permanent Address'}")`);
  const addressRow = heading.closest('tr').next();          // Address
  const districtRow = addressRow.next();                    // District
  const cityPinRow = districtRow.next();                    // City/PIN
  const stateRow = cityPinRow.next();                       // State

  const colIndex = type === 'correspondence' ? 1 : 3;

  const address = addressRow.find('td').eq(colIndex).text().replace(/\u00a0/g, ' ').trim();
  const district = districtRow.find('td').eq(colIndex).text().replace(/\u00a0/g, ' ').trim();
  const cityPin = cityPinRow.find('td').eq(colIndex).text().replace(/\u00a0/g, ' ').trim();
  const state = stateRow.find('td').eq(colIndex).text().replace(/\u00a0/g, ' ').trim();

  return {
    address,
    district,
    cityPin,
    state
  };
}

