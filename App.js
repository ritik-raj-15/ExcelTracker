import React from 'react';
import {View, Text, TouchableOpacity, PermissionsAndroid, Platform} from 'react-native';
var RNFS = require('react-native-fs');
import XLSX from 'xlsx';

const App = () => {

  // function to handle exporting
  const exportDataToExcel = () => {
    // Created Sample data
    let sample_data_to_export = [{id: '1', name: 'Ritik'},{ id: '2', name: 'Abhinav'}];

    let workBook = XLSX.utils.book_new(); // creating new Workbook
    let workSheet = XLSX.utils.json_to_sheet(sample_data_to_export)   // converting json to excel sheet 
    XLSX.utils.book_append_sheet(workBook,workSheet,"Users") // appending worksheet into workbook;
    const workBookOutput = XLSX.write(workBook, { type: 'binary', bookType: "xlsx" });

    // Write generated excel to Storage
    var path = RNFS.ExternalStorageDirectoryPath  + '/test.xlsx';
    // console.log(path);
    RNFS.writeFile(path, workBookOutput, 'ascii').then((r)=>{
     console.log('Success');
    }).catch((e)=>{
      console.log('Error::', e);
    });

  }
  const handleClick = async () => {
    if (Platform.OS == 'android') {
      try {
        // Check for Permission (check if permission is already given or not)
        let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

     
        if (!isPermitedExternalStorage) {

          // Ask for permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: "Storage permission needed",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );

        
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // Permission Granted (calling our exportDataToExcel function)
            exportDataToExcel();
            console.log("Permission granted");
          } else {
            // Permission denied
            console.log("Permission denied");
          }
        } else {
          // Already have Permission (calling our exportDataToExcel function)
          exportDataToExcel();
        }
      } catch (e) {
        console.log('Error while checking permission');
        console.log(e);
        return
      }
    }
    
  };

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'gray',
        flex: 1,
      }}>
      <TouchableOpacity
        onPress={() => handleClick()}
        style={{
          width: '50%',
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: 'blue',
          marginVertical: 20,
        }}>
        <Text style={{textAlign: 'center', color: 'white'}}>
          Export to Excel
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;