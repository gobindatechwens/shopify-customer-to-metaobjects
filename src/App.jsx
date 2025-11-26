// import React, { useState } from 'react';
// import { Upload, Download, FileText, CheckCircle } from 'lucide-react';
// import Papa from 'papaparse';

// export default function CSVConverter() {
//   const [customerData, setCustomerData] = useState(null);
//   const [metaobjectData, setMetaobjectData] = useState(null);
//   const [fileName, setFileName] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState('');

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setFileName(file.name);
//     setError('');
//     setIsProcessing(true);

//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       dynamicTyping: false,
//       complete: (results) => {
//         try {
//           setCustomerData(results.data);
//           convertToMetaobject(results.data);
//         } catch (err) {
//           setError('Error processing file: ' + err.message);
//         } finally {
//           setIsProcessing(false);
//         }
//       },
//       error: (err) => {
//         setError('Error parsing CSV: ' + err.message);
//         setIsProcessing(false);
//       }
//     });
//   };

//   // const convertToMetaobject = (data) => {
//   //   const metaobjectRows = [];

//   //   data.forEach((customer) => {
//   //     // Create handle from first and last name
//   //     const firstName = (customer['First Name'] || '').trim();
//   //     const lastName = (customer['Last Name'] || '').trim();
//   //     const handle = `${firstName}-${lastName}`.replace(/\s+/g, '-');

//   //     // Get all fields from the customer record
//   //     Object.keys(customer).forEach((fieldName) => {
//   //       const value = customer[fieldName] || '';
        
//   //       // Create metaobject row
//   //       metaobjectRows.push({
//   //         'Handle': handle,
//   //         'Command': 'MERGE',
//   //         'Status': 'Active',
//   //         'Definition: Handle': 'members',
//   //         'Field': fieldName,
//   //         'Value': value,
//   //         '': ''
//   //       });
//   //     });
//   //   });

//   //   setMetaobjectData(metaobjectRows);
//   // };

//   const convertToMetaobject = (data) => {
//     const metaobjectRows = [];

//     // Field name mapping for renaming
//     const fieldMapping = {
//       'Company Title (customer.metafields.custom.company_title)': 'CompanyTitle',
//       'Membership Count (customer.metafields.custom.membership_count)': 'MembershipCount',
//       'Membership Expiration Date (customer.metafields.custom.membership_expiration_date)': 'MembershipExpirationDate',
//       'Membership Status (customer.metafields.custom.membership_status_asta)': 'MembershipStatus',
//       'Membership Origination Date (customer.metafields.custom.member_origination_date)': 'MembershipOriginationDate'
//     };

//     data.forEach((customer) => {
//       // Create handle from first and last name
//       const firstName = (customer['First Name'] || '').trim();
//       const lastName = (customer['Last Name'] || '').trim();
//       const customerID=(customer['Customer ID']||'')
//       // const handle = `${firstName}-${lastName}`.replace(/\s+/g, '-');
//       const handle=customerID


//       // Get all fields from the customer record
//       Object.keys(customer).forEach((fieldName) => {
//         const value = customer[fieldName] || '';
        
//         // Use mapped field name if it exists, otherwise use original
//         const mappedFieldName = fieldMapping[fieldName] || fieldName;
        
//         // Create metaobject row
//         metaobjectRows.push({
//           'Handle': handle,
//           'Command': 'MERGE',
//           'Status': 'Active',
//           'Definition: Handle': 'memberss',
//           'Field': mappedFieldName,
//           'Value': value,
//           '': ''
//         });
//       });
//     });

//     setMetaobjectData(metaobjectRows);
//   };

//   const downloadMetaobject = () => {
//     if (!metaobjectData) return;

//     const csv = Papa.unparse(metaobjectData, {
//       quotes: false,
//       quoteChar: '"',
//       escapeChar: '"',
//       delimiter: ',',
//       header: true,
//       newline: '\n'
//     });

//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
    
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'metaobject.csv');
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const formatPreview = (data, maxRows = 5) => {
//     if (!data || data.length === 0) return null;
    
//     const preview = data.slice(0, maxRows);
//     const keys = Object.keys(preview[0]);
    
//     return (
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-xs border-collapse">
//           <thead>
//             <tr className="bg-gray-100">
//               {keys.map((key, idx) => (
//                 <th key={idx} className="border border-gray-300 px-2 py-1 text-left font-semibold">
//                   {key}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {preview.map((row, idx) => (
//               <tr key={idx} className="hover:bg-gray-50">
//                 {keys.map((key, kidx) => (
//                   <td key={kidx} className="border border-gray-300 px-2 py-1">
//                     {String(row[key]).substring(0, 50)}
//                     {String(row[key]).length > 50 ? '...' : ''}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {data.length > maxRows && (
//           <p className="text-xs text-gray-500 mt-2">
//             Showing {maxRows} of {data.length} rows
//           </p>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg p-8">
//           <div className="flex items-center gap-3 mb-6">
//             <FileText className="w-8 h-8 text-indigo-600" />
//             <h1 className="text-3xl font-bold text-gray-800">
//               Customer Data to Metaobject Converter
//             </h1>
//           </div>

//           <div className="mb-8">
//             <p className="text-gray-600 mb-4">
//               Upload your customer data CSV file to automatically convert it into metaobject format.
//               The converter will process all customers dynamically.
//             </p>

//             <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
//               <input
//                 type="file"
//                 accept=".csv"
//                 onChange={handleFileUpload}
//                 className="hidden"
//                 id="file-upload"
//               />
//               <label
//                 htmlFor="file-upload"
//                 className="cursor-pointer flex flex-col items-center gap-3"
//               >
//                 <Upload className="w-12 h-12 text-indigo-600" />
//                 <span className="text-lg font-semibold text-gray-700">
//                   Click to upload customer data CSV
//                 </span>
//                 <span className="text-sm text-gray-500">
//                   {fileName || 'No file selected'}
//                 </span>
//               </label>
//             </div>

//             {isProcessing && (
//               <div className="mt-4 text-center text-indigo-600">
//                 Processing...
//               </div>
//             )}

//             {error && (
//               <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//                 {error}
//               </div>
//             )}
//           </div>

//           {customerData && (
//             <div className="mb-8">
//               <div className="flex items-center gap-2 mb-4">
//                 <CheckCircle className="w-5 h-5 text-green-600" />
//                 <h2 className="text-xl font-bold text-gray-800">
//                   Customer Data Preview
//                 </h2>
//                 <span className="text-sm text-gray-500">
//                   ({customerData.length} customer{customerData.length !== 1 ? 's' : ''})
//                 </span>
//               </div>
//               {formatPreview(customerData)}
//             </div>
//           )}

//           {metaobjectData && (
//             <div className="mb-8">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-2">
//                   <CheckCircle className="w-5 h-5 text-green-600" />
//                   <h2 className="text-xl font-bold text-gray-800">
//                     Metaobject Data Preview
//                   </h2>
//                   <span className="text-sm text-gray-500">
//                     ({metaobjectData.length} rows)
//                   </span>
//                 </div>
//                 <button
//                   onClick={downloadMetaobject}
//                   className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md"
//                 >
//                   <Download className="w-5 h-5" />
//                   Download Metaobject CSV
//                 </button>
//               </div>
//               {formatPreview(metaobjectData, 10)}
//             </div>
//           )}

//           {!customerData && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
//               <h3 className="font-semibold text-gray-800 mb-2">How it works:</h3>
//               <ul className="list-disc list-inside text-gray-700 space-y-1">
//                 <li>Upload your customer data CSV file</li>
//                 <li>The converter processes all customers automatically</li>
//                 <li>Each customer field is converted to a separate metaobject row</li>
//                 <li>Handle is generated from First Name and Last Name</li>
//                 <li>Download the converted metaobject CSV file</li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { Upload, Download, FileText, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';

export default function CSVConverter() {
  const [customerData, setCustomerData] = useState(null);
  const [metaobjectData, setMetaobjectData] = useState(null);
  const [metaobjectBatches, setMetaobjectBatches] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const BATCH_SIZE = 10;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        try {
          setCustomerData(results.data);
          convertToMetaobject(results.data);
        } catch (err) {
          setError('Error processing file: ' + err.message);
        } finally {
          setIsProcessing(false);
        }
      },
      error: (err) => {
        setError('Error parsing CSV: ' + err.message);
        setIsProcessing(false);
      }
    });
  };

  const convertToMetaobject = (data) => {
    const allMetaobjectRows = [];

    // Field name mapping for renaming
    const fieldMapping = {
      'Company Title (customer.metafields.custom.company_title)': 'CompanyTitle',
      'Membership Count (customer.metafields.custom.membership_count)': 'MembershipCount',
      'Membership Expiration Date (customer.metafields.custom.membership_expiration_date)': 'MembershipExpirationDate',
      'Membership Status (customer.metafields.custom.membership_status_asta)': 'MembershipStatus',
      'Membership Origination Date (customer.metafields.custom.member_origination_date)': 'MembershipOriginationDate'
    };

    data.forEach((customer) => {
      // Create handle from first and last name
      const firstName = (customer['First Name'] || '').trim();
      const lastName = (customer['Last Name'] || '').trim();
      const customerID=(customer['Customer ID']||'')
      // const handle = `${firstName}-${lastName}`.replace(/\s+/g, '-');
      const handle=customerID


      // Get all fields from the customer record
      Object.keys(customer).forEach((fieldName) => {
        const value = customer[fieldName] || '';
        
        // Use mapped field name if it exists, otherwise use original
        const mappedFieldName = fieldMapping[fieldName] || fieldName;
        
        // Create metaobject row
        allMetaobjectRows.push({
          'Handle': handle,
          'Command': 'MERGE',
          'Status': 'Active',
          'Definition: Handle': 'memberss',
          'Field': mappedFieldName,
          'Value': value,
          '': ''
        });
      });
    });

    setMetaobjectData(allMetaobjectRows);

    // Split into batches based on unique customer handles
    const batches = [];
    const fieldsPerCustomer = Object.keys(data[0]).length;
    
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batchCustomers = data.slice(i, Math.min(i + BATCH_SIZE, data.length));
      const startRowIndex = i * fieldsPerCustomer;
      const endRowIndex = startRowIndex + (batchCustomers.length * fieldsPerCustomer);
      batches.push(allMetaobjectRows.slice(startRowIndex, endRowIndex));
    }
    
    setMetaobjectBatches(batches);
  };

  const downloadMetaobject = (batchIndex) => {
    if (!metaobjectBatches || metaobjectBatches.length === 0) return;

    const batchData = batchIndex !== undefined ? metaobjectBatches[batchIndex] : metaobjectData;

    const csv = Papa.unparse(batchData, {
      quotes: false,
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ',',
      header: true,
      newline: '\n'
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const downloadFileName = batchIndex !== undefined 
      ? `metaobject_batch_${batchIndex + 1}.csv`
      : 'metaobject.csv';
    
    link.setAttribute('href', url);
    link.setAttribute('download', downloadFileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllBatches = () => {
    metaobjectBatches.forEach((_, index) => {
      setTimeout(() => downloadMetaobject(index), index * 500);
    });
  };

  const formatPreview = (data, maxRows = 5) => {
    if (!data || data.length === 0) return null;
    
    const preview = data.slice(0, maxRows);
    const keys = Object.keys(preview[0]);
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {keys.map((key, idx) => (
                <th key={idx} className="border border-gray-300 px-2 py-1 text-left font-semibold">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {keys.map((key, kidx) => (
                  <td key={kidx} className="border border-gray-300 px-2 py-1">
                    {String(row[key]).substring(0, 50)}
                    {String(row[key]).length > 50 ? '...' : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > maxRows && (
          <p className="text-xs text-gray-500 mt-2">
            Showing {maxRows} of {data.length} rows
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Customer Data to Metaobject Converter
            </h1>
          </div>

          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              Upload your customer data CSV file to automatically convert it into metaobject format.
              The converter will process all customers and split them into batches of {BATCH_SIZE} customers each.
            </p>

            <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload className="w-12 h-12 text-indigo-600" />
                <span className="text-lg font-semibold text-gray-700">
                  Click to upload customer data CSV
                </span>
                <span className="text-sm text-gray-500">
                  {fileName || 'No file selected'}
                </span>
              </label>
            </div>

            {isProcessing && (
              <div className="mt-4 text-center text-indigo-600">
                Processing...
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>

          {customerData && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  Customer Data Preview
                </h2>
                <span className="text-sm text-gray-500">
                  ({customerData.length} customer{customerData.length !== 1 ? 's' : ''})
                </span>
              </div>
              {formatPreview(customerData)}
            </div>
          )}

          {metaobjectData && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Metaobject Data Preview
                  </h2>
                  <span className="text-sm text-gray-500">
                    ({metaobjectData.length} rows, {metaobjectBatches.length} batch{metaobjectBatches.length !== 1 ? 'es' : ''})
                  </span>
                </div>
                <button
                  onClick={downloadAllBatches}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md"
                >
                  <Download className="w-5 h-5" />
                  Download All Batches ({metaobjectBatches.length})
                </button>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Data split into {metaobjectBatches.length} CSV files</strong> ({BATCH_SIZE} customers per batch)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {metaobjectBatches.map((batch, index) => {
                    const customersInBatch = batch.length / Object.keys(customerData[0]).length;
                    return (
                      <button
                        key={index}
                        onClick={() => downloadMetaobject(index)}
                        className="text-sm bg-white border border-indigo-300 text-indigo-700 px-3 py-2 rounded hover:bg-indigo-50 transition-colors"
                      >
                        Batch {index + 1} ({Math.round(customersInBatch)} customers)
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {formatPreview(metaobjectData, 10)}
            </div>
          )}

          {!customerData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-2">How it works:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Upload your customer data CSV file</li>
                <li>The converter processes all customers automatically</li>
                <li>Data is split into batches of {BATCH_SIZE} customers each</li>
                <li>Each customer field is converted to a separate metaobject row</li>
                <li>Handle is generated from Customer ID</li>
                <li>Download all batches at once or individual batch files</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}