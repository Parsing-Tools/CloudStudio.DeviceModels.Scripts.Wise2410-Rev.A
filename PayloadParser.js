function parseUplink(device, payload) {

    var decoded = payload.asParsedObject();
    env.log(decoded);

    // Store battery
    if (decoded.payload.Device.BatteryVolt != null) {
        var sensor1 = device.endpoints.byAddress("4");

       if (sensor1 != null)
            sensor1.updateVoltageSensorStatus(decoded.payload.Device.BatteryVolt);
              device.updateDeviceBattery({ voltage: decoded.payload.Device.BatteryVolt });

    };

    // Store Vibration X-Axis
    if (decoded.payload.Accelerometer.XAxis.CrestFactor != null) {
        var sensor2 = device.endpoints.byAddress("1");

        if (sensor2 != null)
            sensor2.updateGenericSensorStatus(decoded.payload.Accelerometer.XAxis.CrestFactor);
    };

    // Store Vibration Y-Axis
    if (decoded.payload.Accelerometer.YAxis.CrestFactor != null) {
        var sensor3 = device.endpoints.byAddress("2");

        if (sensor3 != null)
            sensor3.updateGenericSensorStatus(decoded.payload.Accelerometer.YAxis.CrestFactor);
    };

    // Store Vibration Z-Axis
    if (decoded.payload.Accelerometer.ZAxis.CrestFactor != null) {
        var sensor3 = device.endpoints.byAddress("3");

        if (sensor3 != null)
            sensor3.updateGenericSensorStatus(decoded.payload.Accelerometer.ZAxis.CrestFactor);
    };

}

function buildDownlink(device, endpoint, command, payload) 
{ 
	// This function allows you to convert a command from the platform 
	// into a payload to be sent to the device.
	// Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device to which the command will
	//   be sent. 
	// - endpoint: endpoint object representing the endpoint to which the 
	//   command will be sent. May be null if the command is to be sent to 
	//   the device, and not to an individual endpoint within the device.
	// - command: object containing the command that needs to be sent. More
	//   information at https://wiki.cloud.studio/page/1195.

	// This example is written assuming a device that contains a single endpoint, 
	// of type appliance, that can be turned on, off, and toggled. 
	// It is assumed that a single byte must be sent in the payload, 
	// which indicates the type of operation.

/*
	 payload.port = 25; 	 	 // This device receives commands on LoRaWAN port 25 
	 payload.buildResult = downlinkBuildResult.ok; 

	 switch (command.type) { 
	 	 case commandType.onOff: 
	 	 	 switch (command.onOff.type) { 
	 	 	 	 case onOffCommandType.turnOn: 
	 	 	 	 	 payload.setAsBytes([30]); 	 	 // Command ID 30 is "turn on" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.turnOff: 
	 	 	 	 	 payload.setAsBytes([31]); 	 	 // Command ID 31 is "turn off" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.toggle: 
	 	 	 	 	 payload.setAsBytes([32]); 	 	 // Command ID 32 is "toggle" 
	 	 	 	 	 break; 
	 	 	 	 default: 
	 	 	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 	 	 break; 
	 	 	 } 
	 	 	 break; 
	 	 default: 
	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 break; 
	 }
*/

}


///////////////////////////////////////////////////////////////////
// Advantech
//
// Frame Data Parser for WISE Lora modules (execute in TTNv3)
//
// version: 1.0.1 <2023/02/8>
//
///////////////////////////////////////////////////////////////////
function decodeUplink(input) {
    ///////////////////////////////////////
	// User defined variables
	///////////////////////////////////////

	//Min Frame length
	var MIN_FRAME_LENGTH = 4;

	//Header
	var MASK_HEADER_FIRST_SEGMENT = 0x80;
	var MASK_HEADER_ADDRESS_MODE = 0x0C;
	var MASK_HEADER_ADDRESS_NONE = 0x00;
	var MASK_HEADER_ADDRESS_2_OCTECT = 0x04;
	var MASK_HEADER_ADDRESS_8_OCTECT = 0x08;
	var MASK_HEADER_FRAME_VERSION = 0x03;

	//Payload Data
	//AI
	var PAYLOAD_DI_DATA = 0x00;
	//DO
	var PAYLOAD_DO_DATA = 0x10;
	//DI
	var PAYLOAD_AI_DATA = 0x30;
	//Sensor
	var PAYLOAD_SENSOR_DATA = 0x50;
	//Device Status
	var PAYLOAD_DEVICE_DATA = 0x60;
	//Coil data
	var PAYLOAD_COIL_DATA = 0x70;
	//Register data
	var PAYLOAD_REGISTER_DATA = 0x80;

	//DI
	var MASK_PAYLOAD_DI_STATUS = 0x01;
	var MASK_PAYLOAD_DI_VALUE = 0x02;
	var MASK_PAYLOAD_DI_EVENT = 0x04;
	var DI_MODE_FREQUENCY = 4;

	//DO
	var MASK_PAYLOAD_DO_STATUS = 0x01;
	var MASK_PAYLOAD_DO_ABSOLUTE_PULSE_OUTPUT = 0x02;
	var MASK_PAYLOAD_DO_INCREMENTAL_PULSE_OUTPUT = 0x04;

	//AI
	var MASK_PAYLOAD_AI_STATUS = 0x01;
	var MASK_PAYLOAD_AI_RAW_VALUE = 0x02;
	var MASK_PAYLOAD_AI_EVENT = 0x04;
	var MASK_PAYLOAD_AI_MAX_VALUE = 0x08;
	var MASK_PAYLOAD_AI_MIN_VALUE = 0x10;

	var MASK_PAYLOAD_AI_MASK2_RANGE = 0x01;

	//Sensor Range
	var MASK_PAYLOAD_SENSOR_TEMP_C_TYPE = 0x00;
	var MASK_PAYLOAD_SENSOR_TEMP_F_TYPE = 0x01;
	var MASK_PAYLOAD_SENSOR_TEMP_K_TYPE = 0x02;
	var MASK_PAYLOAD_SENSOR_HUMIDITY_TYPE = 0x03;
	var MASK_PAYLOAD_SENSOR_ACCELERATOR_TYPE_G = 0x04;
	var MASK_PAYLOAD_SENSOR_ACCELERATOR_TYPE_MS2 = 0x05;

	var MASK_PAYLOAD_SENSOR_MASK_SENSNSOR_STATUS = 0x01;
	var MASK_PAYLOAD_SENSOR_MASK_SENSNSOR_EVENT = 0x02;
	var MASK_PAYLOAD_SENSOR_MASK_SENSNSOR_VALUE = 0x04;
	var MASK_PAYLOAD_SENSOR_MASK_SENSNSOR_MAX_VALUE = 0x08;
	var MASK_PAYLOAD_SENSOR_MASK_SENSNSOR_MIN_VALUE = 0x10;

	var MASK_PAYLOAD_SENSOR_AXIS_X_MASK = 0x01;
	var MASK_PAYLOAD_SENSOR_AXIS_Y_MASK = 0x02;
	var MASK_PAYLOAD_SENSOR_AXIS_Z_MASK = 0x04;

	var MASK_PAYLOAD_SENSOR_MASK2_LOGINDEX = 0x01;
	var MASK_PAYLOAD_SENSOR_MASK2_TIME = 0x02;

	//Sensor Extend Mask
	var MASK_PAYLOAD_SENSOR_EXTMASK_VELOCITY = 0x01;
	var MASK_PAYLOAD_SENSOR_EXTMASK_PEAK = 0x02;
	var MASK_PAYLOAD_SENSOR_EXTMASK_RMS = 0x04;
	var MASK_PAYLOAD_SENSOR_EXTMASK_KURTOSIS = 0x08;
	var MASK_PAYLOAD_SENSOR_EXTMASK_CRESTFACTOR = 0x10;
	var MASK_PAYLOAD_SENSOR_EXTMASK_SKEWNESS = 0x20;
	var MASK_PAYLOAD_SENSOR_EXTMASK_STDDEVIATION = 0x40;
	var MASK_PAYLOAD_SENSOR_EXTMASK_DISPLACEMENT = 0x80;

	//Massive data
	var MASK_PAYLOAD_SENSOR_EXTMASK_B = 0x01;
	var MASK_PAYLOAD_SENSOR_EXTMASK_MASSIVE_DATA_INFO = 0x01;
	var MASK_PAYLOAD_SENSOR_EXTMASK_MASSIVE_DATA_SEC = 0x02;
	var MASK_PAYLOAD_SENSOR_EXTMASK_MASSIVE_DATA_LOG = 0x04;

	//Massive Data Type
	var MASK_PAYLOAD_SENSOR_MASSIVE_DATA_TYPE_MASSIVE_TYPE = 0x03;
	var MASK_PAYLOAD_SENSOR_MASSIVE_DATA_TYPE_SAMPLE_PER_AXIS = 0x0C;
	var MASK_PAYLOAD_SENSOR_MASSIVE_DATA_TYPE_BYTES_PER_SAMPLE = 0x10;
	var MASK_PAYLOAD_SENSOR_MASSIVE_DATA_TYPE_MASSIVE_TYPE_FFT = 0x01;

	//Device Status
	var MASK_DEVICE_EVENT = 0x01;
	var MASK_DEVICE_POWER_SOURCE = 0x02;
	var MASK_DEVICE_BATTERY_LEVEL = 0x04;
	var MASK_DEVICE_BATTERY_VOLTAGE = 0x08;
	var MASK_DEVICE_TIMESTAMP = 0x10;
	var MASK_DEVICE_POSITION = 0x20;

	var MASK_DEVICE_POSITION_LATITUDE = 0x02;
	var MASK_DEVICE_POSITION_LONGITUDE = 0x01;

	//Coil Data
	var MASK_PAYLOAD_COIL_STATUS = 0x01;
	var MASK_PAYLOAD_COIL_VALUE = 0x02;
	var MASK_PAYLOAD_COIL_MULTI_CH = 0x04;

	//Register Data
	var MASK_PAYLOAD_REGISTER_STATUS = 0x01;
	var MASK_PAYLOAD_REGISTER_VALUE = 0x02;
	var MASK_PAYLOAD_REGISTER_MULTI_CH = 0x04;

    ////////////////////////
    // Variables
    ////////////////////////
    var version;
    var message = {}; //output of this program
    var i, arrLength;
	var hexArr; //translated hex arry from input string
    var hexPayloadArr = [];
	var arrayIndex = 0; //index of current processing position in hexArr
    var au8CRC8_Pol07_Table = [ // 8bit-CRC: 0x07 = x8 + x2 + x + 1
		0x00,0x07,0x0E,0x09,0x1C,0x1B,0x12,0x15,
		0x38,0x3F,0x36,0x31,0x24,0x23,0x2A,0x2D,
		0x70,0x77,0x7E,0x79,0x6C,0x6B,0x62,0x65,
		0x48,0x4F,0x46,0x41,0x54,0x53,0x5A,0x5D,
		0xE0,0xE7,0xEE,0xE9,0xFC,0xFB,0xF2,0xF5,
		0xD8,0xDF,0xD6,0xD1,0xC4,0xC3,0xCA,0xCD,
		0x90,0x97,0x9E,0x99,0x8C,0x8B,0x82,0x85,
		0xA8,0xAF,0xA6,0xA1,0xB4,0xB3,0xBA,0xBD,
		0xC7,0xC0,0xC9,0xCE,0xDB,0xDC,0xD5,0xD2,
		0xFF,0xF8,0xF1,0xF6,0xE3,0xE4,0xED,0xEA,
		0xB7,0xB0,0xB9,0xBE,0xAB,0xAC,0xA5,0xA2,
		0x8F,0x88,0x81,0x86,0x93,0x94,0x9D,0x9A,
		0x27,0x20,0x29,0x2E,0x3B,0x3C,0x35,0x32,
		0x1F,0x18,0x11,0x16,0x03,0x04,0x0D,0x0A,
		0x57,0x50,0x59,0x5E,0x4B,0x4C,0x45,0x42,
		0x6F,0x68,0x61,0x66,0x73,0x74,0x7D,0x7A,
		0x89,0x8E,0x87,0x80,0x95,0x92,0x9B,0x9C,
		0xB1,0xB6,0xBF,0xB8,0xAD,0xAA,0xA3,0xA4,
		0xF9,0xFE,0xF7,0xF0,0xE5,0xE2,0xEB,0xEC,
		0xC1,0xC6,0xCF,0xC8,0xDD,0xDA,0xD3,0xD4,
		0x69,0x6E,0x67,0x60,0x75,0x72,0x7B,0x7C,
		0x51,0x56,0x5F,0x58,0x4D,0x4A,0x43,0x44,
		0x19,0x1E,0x17,0x10,0x05,0x02,0x0B,0x0C,
		0x21,0x26,0x2F,0x28,0x3D,0x3A,0x33,0x34,
		0x4E,0x49,0x40,0x47,0x52,0x55,0x5C,0x5B,
		0x76,0x71,0x78,0x7F,0x6A,0x6D,0x64,0x63,
		0x3E,0x39,0x30,0x37,0x22,0x25,0x2C,0x2B,
		0x06,0x01,0x08,0x0F,0x1A,0x1D,0x14,0x13,
		0xAE,0xA9,0xA0,0xA7,0xB2,0xB5,0xBC,0xBB,
		0x96,0x91,0x98,0x9F,0x8A,0x8D,0x84,0x83,
		0xDE,0xD9,0xD0,0xD7,0xC2,0xC5,0xCC,0xCB,
		0xE6,0xE1,0xE8,0xEF,0xFA,0xFD,0xF4,0xF3
	];

	////////////////////////////////////////////
	// Functions
	////////////////////////////////////////////
    function addZero(i) {
		i = i + "";
		if (i.length < 2) {
			i = "0" + i;
		}
		return i;
	}

	function translateInt32(a, b, c ,d) {
		return (d << 24) + (c << 16) + (b << 8) + a;
	}

	function translateInt24(a, b, c) {
		return (c << 16) + (b << 8) + a;
	}

	function translateInt16(a, b) {
		return a + (b << 8);
	}

	function convertMaskToArray(number, channelCount) {
		var biArray = [];
		var temp;
		for (var i = 0; i < channelCount; ++i) {
			temp = number;
			temp = temp >> i;
			biArray.push(temp & 1);
		}
		return biArray;
	}

	function convertToSignedInt16(number) {
		if ((number & 0x8000) > 0) {
			number = number - 0x10000;
		}
		return number;
	}

	function convertToSignedInt32(number) {
		if ((number & 0x80000000) > 0) {
			number = number - 0x100000000;
		}
		return number;
	}

	function parseAxisData(index, bIsSensorEventExist, extMask, jsonObj, range){
		if(bIsSensorEventExist){
			jsonObj.SenEvent = translateInt16(hexArr[index++], hexArr[index++]);
		}
		if(extMask & MASK_PAYLOAD_SENSOR_EXTMASK_VELOCITY){
			jsonObj.OAVelocity = translateInt16(hexArr[index++], hexArr[index++]) / 100;
		}
		if(extMask & MASK_PAYLOAD_SENSOR_EXTMASK_PEAK){
			if (range === MASK_PAYLOAD_SENSOR_ACCELERATOR_TYPE_G) {
				jsonObj.Peakmg = translateInt16(hexArr[index++], hexArr[index++]) / 1000;
			} else {
				jsonObj.Peakmg = translateInt16(hexArr[index++], hexArr[index++]) / 100;
			}
		}
		if(extMask & MASK_PAYLOAD_SENSOR_EXTMASK_RMS){
			if (range === MASK_PAYLOAD_SENSOR_ACCELERATOR_TYPE_G) {
				jsonObj.RMSmg = translateInt16(hexArr[index++], hexArr[index++]) / 1000;
			} else {
				jsonObj.RMSmg = translateInt16(hexArr[index++], hexArr[index++]) / 100;
			}
		}
		if(extMask & MASK_PAYLOAD_SENSOR_EXTMASK_KURTOSIS){
			jsonObj.Kurtosis = convertToSignedInt16(translateInt16(hexArr[index++], hexArr[index++])) / 100;
		}
		if(extMask & MASK_PAYLOAD_SENSOR_EXTMASK_CRESTFACTOR){
			jsonObj.CrestFactor = convertToSignedInt16(translateInt16(hexArr[index++], hexArr[index++])) / 100;
		}
		if(extMask & MASK_PAYLOAD_SENSOR_EXTMASK_SKEWNESS){
			jsonObj.Skewness = convertToSignedInt16(translateInt16(hexArr[index++], hexArr[index++])) / 100;
		}
		if(extMask & MASK_PAYLOAD_SENSOR_EXTMASK_STDDEVIATION){
			jsonObj.Deviation = convertToSignedInt16(translateInt16(hexArr[index++], hexArr[index++])) / 100;
		}
		if(extMask & MASK_PAYLOAD_SENSOR_EXTMASK_DISPLACEMENT){
			jsonObj['Peak-to-Peak Displacement'] = translateInt16(hexArr[index++], hexArr[index++]);
		}

		return index;
	}

	function DIParse(index){
		var length;
		var mode = hexArr[index++] & 0x0F;

		if (version > 0) {
			length = hexArr[index++];
		}

		var channel = hexArr[index++];
		if (version > 0) length -= 1; // channel index and mask
		var channelIndex = (channel & 0xE0) >> 5;
		var channelMask = channel & 0x07;

		message['DI'+channelIndex] = {};

		if (channelMask & MASK_PAYLOAD_DI_STATUS) {
			var arrBinary = convertMaskToArray(hexArr[index++], 8);
			if (version > 0) length -= 1;

			message['DI'+channelIndex].status = {};
			message['DI'+channelIndex].status['Signal Logic'] = arrBinary[0];
			message['DI'+channelIndex].status['Start Counter'] = arrBinary[1];
			message['DI'+channelIndex].status['Get/Clean Counter Overflow'] = arrBinary[2];
			// message['DI'+channelIndex].status['Clean Counter Status'] = arrBinary[3];
			message['DI'+channelIndex].status['Get/Clean L2H Latch'] = arrBinary[4];
			message['DI'+channelIndex].status['Get/Clean H2L Latch'] = arrBinary[5];
		}

		message['DI'+channelIndex].mode = mode;

		if (channelMask & MASK_PAYLOAD_DI_VALUE) {
			if (mode == DI_MODE_FREQUENCY) { // frequency mode
				message['DI'+channelIndex].Frequency_Value = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]);
			} else {
				message['DI'+channelIndex].Counter_Value = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]);
			}
			if (version > 0) length -= 4;
		}

		if (channelMask & MASK_PAYLOAD_DI_EVENT) {
			message['DI'+channelIndex].Event = hexArr[index++];
			 if (version > 0) length -= 1;
		}

		if (version > 0) {
			if (length > 0) {
				index += length;
			}
		}

		return index;
	}

	function DOParse(index){
		var length;
		var mode = hexArr[index++] & 0x0F;

		if (version > 0) {
			length = hexArr[index++];
		}

		var channel = hexArr[index++];
		if (version > 0) length -= 1; // channel index and mask
		var channelIndex = (channel & 0xE0) >> 5;
		var channelMask = channel & 0x07;

		message['DO'+channelIndex] = {};

		var modeText = '';
		switch (mode) {
			case 0:
				modeText = 'DO';
				break;
			case 1:
				modeText = 'Pulse output';
				break;
			case 2:
				modeText = 'Low to High delay';
				break;
			case 3:
				modeText = 'High to Low delay';
				break;
			case 4:
				modeText = 'AI alarm drive';
				break;
		}
		message['DO'+channelIndex].Mode = modeText;

		if (channelMask & MASK_PAYLOAD_DO_STATUS) {
			var status = convertMaskToArray(hexArr[index++], 8);
			if (version > 0) length -= 1;
			message['DO'+channelIndex].status = {};
			message['DO'+channelIndex].status['Signal Logic'] = status[0];
			message['DO'+channelIndex].status['Pulse Output Continue'] = status[1];
		}
		if (mode == 1) {
			message['DO'+channelIndex].PulsAbs = 0;
			message['DO'+channelIndex].PulsInc = 0;
		}
		if (channelMask & MASK_PAYLOAD_DO_ABSOLUTE_PULSE_OUTPUT) {
			message['DO'+channelIndex].PulsAbs = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]);
			if (version > 0) length -= 4;
		}
		if (channelMask & MASK_PAYLOAD_DO_INCREMENTAL_PULSE_OUTPUT) {
			message['DO'+channelIndex].PulsInc = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]);
			if (version > 0) length -= 4;
		}

		if (version > 0) {
			if (length > 0) {
				index += length;
			}
		}

		return index;
	}

	function AIParse(index){
		var length;
		var range = hexArr[index++] & 0x0F;

		if (version > 0) {
			length = hexArr[index++];
		}

		var channel = hexArr[index++];
		if (version > 0) length -= 1; // channel index and mask
		var channelIndex = (channel & 0xE0) >> 5;
		var channelMask = channel & 0x1F;

		message['AI'+channelIndex] = {};
		message['AI'+channelIndex].Range = range;

		if (channelMask & MASK_PAYLOAD_AI_STATUS) {
			var status = convertMaskToArray(hexArr[index++], 8);
			if (version > 0) length -= 1;
			message['AI'+channelIndex].status = {};
			message['AI'+channelIndex].status['Low Alarm'] = status[0];
			message['AI'+channelIndex].status['High Alarm'] = status[1];
		}
		if (channelMask & MASK_PAYLOAD_AI_RAW_VALUE) {
			message['AI'+channelIndex]['Raw Data'] = translateInt16(hexArr[index++], hexArr[index++]);
			if (version > 0) length -= 2;
		}
		if (channelMask & MASK_PAYLOAD_AI_EVENT) {
			message['AI'+channelIndex].Event = translateInt16(hexArr[index++], hexArr[index++]);
			if (version > 0) length -= 2;
		}
		if (channelMask & MASK_PAYLOAD_AI_MAX_VALUE) {
			message['AI'+channelIndex].MaxVal = translateInt16(hexArr[index++], hexArr[index++]);
			if (version > 0) length -= 2;
		}
		if (channelMask & MASK_PAYLOAD_AI_MIN_VALUE) {
			message['AI'+channelIndex].MinVal = translateInt16(hexArr[index++], hexArr[index++]);
			if (version > 0) length -= 2;
		}

		if (version > 0 && length > 0) {
			var mask2 = hexArr[index++];
			length -= 1;
			if (mask2 & MASK_PAYLOAD_AI_MASK2_RANGE) {
				message['AI'+channelIndex].Range = hexArr[index++];
				length -= 1;
			}
			if (length > 0) {
				index += length;
			}
		}

		return index;
	}

	function sensorParse(index){
		var length;
		var range = hexArr[index] & 0x0F;
		//Temperature/Humidity
		if(range === MASK_PAYLOAD_SENSOR_TEMP_C_TYPE || range === MASK_PAYLOAD_SENSOR_TEMP_F_TYPE ||
				range === MASK_PAYLOAD_SENSOR_TEMP_K_TYPE || range === MASK_PAYLOAD_SENSOR_HUMIDITY_TYPE){

			if (version > 0) {
				index++;
				length = hexArr[index];
			}

			message.TempHumi = {};
			message.TempHumi.Range = range;
			index++;
			//message.TempHumi.ChIdx = hexArr[index] & 0xE0;
			mask = hexArr[index] & 0x1F;
			if (version > 0) length -= 1; // channel index and mask
			index++;

			//if sensor status exist
			if(mask & MASK_PAYLOAD_SENSOR_MASK_SENSNSOR_STATUS){
				message.TempHumi.Status = hexArr[index++];
				if (version > 0) length -= 1;
			}
			//if sensor event exist
			if(mask & MASK_PAYLOAD_SENSOR_MASK_SENSNSOR_EVENT){
				message.TempHumi.Event = translateInt16(hexArr[index++], hexArr[index++]);
				if (version > 0) length -= 2;
			}
			//if sensor value exist
			if(mask & MASK_PAYLOAD_SENSOR_MASK_SENSNSOR_VALUE){
				if (range === MASK_PAYLOAD_SENSOR_HUMIDITY_TYPE) {
					message.TempHumi.SenVal = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]) / 1000;
				} else {
					message.TempHumi.SenVal = convertToSignedInt32(translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++])) / 1000;
				}
				if (version > 0) length -= 4;
			}
			//if sensor MAX value exist
			if(mask & MASK_PAYLOAD_SENSOR_MASK_SENSNSOR_MAX_VALUE){
				message.TempHumi.SenMaxVal = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]) / 100;
				if (version > 0) length -= 4;
			}
			//if sensor MIN value exist
			if(mask & MASK_PAYLOAD_SENSOR_MASK_SENSNSOR_MIN_VALUE){
				message.TempHumi.SenMinVal = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]) / 100;
				if (version > 0) length -= 4;
			}

			if (version > 0) {
				// reserved
				// var mask2 = hexArr[index++];
				if (length > 0) {
					index += length;
				}
			}
		}
		if(range === MASK_PAYLOAD_SENSOR_ACCELERATOR_TYPE_G || range === MASK_PAYLOAD_SENSOR_ACCELERATOR_TYPE_MS2){
			bIsSensorEventExist = false;

			if (version > 0) {
				index++;
				var length = hexArr[index];
			}

			index++;
			axisMask = (hexArr[index] & 0xE0) >> 5;

			var arrAxisMask = convertMaskToArray(axisMask, 8);
			var intAxisMaskEnable = 0;
			arrAxisMask.forEach(function (item) {
				if (item == 1) {
					intAxisMaskEnable++;
				}
			});

			mask = hexArr[index] & 0x1F;
			index++;
			extMask = hexArr[index]; //extend mask

			var arrExtMask = convertMaskToArray(extMask, 8);
			var intExtMaskEnable = 0;
			arrExtMask.forEach(function (item) {
				if (item == 1) {
					intExtMaskEnable++;
				}
			});

			if (!(mask & MASK_PAYLOAD_SENSOR_EXTMASK_B)) {
				message.Accelerometer = {};

				//if sensor event exist
				if(mask & MASK_PAYLOAD_SENSOR_MASK_SENSNSOR_EVENT){
					bIsSensorEventExist = true;
				}
				index++;

				if(axisMask & MASK_PAYLOAD_SENSOR_AXIS_X_MASK){
					message.Accelerometer["X-Axis"] = {};
					index = parseAxisData(index, bIsSensorEventExist, extMask, message.Accelerometer["X-Axis"], range);
				}
				if(axisMask & MASK_PAYLOAD_SENSOR_AXIS_Y_MASK){
					message.Accelerometer["Y-Axis"] = {};
					index = parseAxisData(index, bIsSensorEventExist, extMask, message.Accelerometer["Y-Axis"], range);
				}
				if(axisMask & MASK_PAYLOAD_SENSOR_AXIS_Z_MASK){
					message.Accelerometer["Z-Axis"] = {};
					index = parseAxisData(index, bIsSensorEventExist, extMask, message.Accelerometer["Z-Axis"], range);
				}

				length = length - 2 - (intAxisMaskEnable * (intExtMaskEnable * 2 + (bIsSensorEventExist ? 2 : 0))); // Length - (Axis Mask + Mask) - Extend Mask A - Axis Data
				message.Accelerometer.LogIndex = 0;
				if (version > 0 && length > 0) {
					var mask2 = hexArr[index++];
					length -= 1;
					if (mask2 & MASK_PAYLOAD_SENSOR_MASK2_LOGINDEX) {
						message.Accelerometer.LogIndex = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]);
						length -= 4;
					}
					if (mask2 & MASK_PAYLOAD_SENSOR_MASK2_TIME) {
						message.Accelerometer.Time = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]);
						length -= 4;
					}
					if (length > 0) {
						index += length;
					}
				}
			} else { // extend mask B
				var FFTDataStorage = {};
				index++;
				if (extMask & MASK_PAYLOAD_SENSOR_EXTMASK_MASSIVE_DATA_INFO) {
					var dataType = hexArr[index++];
					var sampleRate = translateInt24(hexArr[index++], hexArr[index++], hexArr[index++]);
					var points = translateInt16(hexArr[index++], hexArr[index++]);
					var logIndex = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]);
					var timestamp = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]);
					var totalLength = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]);
					var massType = dataType & MASK_PAYLOAD_SENSOR_MASSIVE_DATA_TYPE_MASSIVE_TYPE;
					var bytesPerSample = (((dataType & MASK_PAYLOAD_SENSOR_MASSIVE_DATA_TYPE_BYTES_PER_SAMPLE) >> 4) > 0) ? 4 : 2;
					var samplesPerAxis = (massType == MASK_PAYLOAD_SENSOR_MASSIVE_DATA_TYPE_MASSIVE_TYPE_FFT && ((dataType & MASK_PAYLOAD_SENSOR_MASSIVE_DATA_TYPE_SAMPLE_PER_AXIS) >> 2) > 0) ? (points/2.56/2) : (points/2.56);
					var bytesPerAxis = bytesPerSample * samplesPerAxis;

					// length = length - Massive Info
					length = length - 18;

					FFTDataStorage.timestamp = timestamp;
					FFTDataStorage.lastSeq = hexArr[1];
					FFTDataStorage.lastPayload = hexArr;
					FFTDataStorage.logIndex = logIndex;
					FFTDataStorage.sampleRate = sampleRate;
					FFTDataStorage.points = points;
					FFTDataStorage.bytesPerSample = bytesPerSample;
					FFTDataStorage.samplesPerAxis = samplesPerAxis;
					FFTDataStorage.bytesPerAxis = bytesPerAxis;
					FFTDataStorage.totalLength = totalLength;
				}
				if (extMask & MASK_PAYLOAD_SENSOR_EXTMASK_MASSIVE_DATA_SEC) {
					if (typeof FFTDataStorage.timestamp == 'undefined') {
						throw "FFT Data lost first packet.";
					}

					var axisType = ['X', 'Y', 'Z'];
					if (!(axisMask & MASK_PAYLOAD_SENSOR_AXIS_X_MASK)) {
						var axisIndex = axisType.indexOf('X');
						if (axisIndex > -1) {
							axisType.splice(axisIndex, 1);
						}
					}
					if (!(axisMask & MASK_PAYLOAD_SENSOR_AXIS_Y_MASK)) {
						var axisIndex = axisType.indexOf('Y');
						if (axisIndex > -1) {
							axisType.splice(axisIndex, 1);
						}
					}
					if (!(axisMask & MASK_PAYLOAD_SENSOR_AXIS_Z_MASK)) {
						var axisIndex = axisType.indexOf('Z');
						if (axisIndex > -1) {
							axisType.splice(axisIndex, 1);
						}
					}

					var logIndex = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]);
					var initialOffset = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]);
					var offset = initialOffset;
					// length = length - (Axis Mask + Mask + Extend Mask + Log Index + Offset)
					length = length - 10;

					message.FFT = {};
					if (!(extMask & MASK_PAYLOAD_SENSOR_EXTMASK_MASSIVE_DATA_INFO)) {
						if (FFTDataStorage.lastSeq === hexArr[1]) {
							throw "Packet of FFT Data duplicated.";
						}

						if (('0x'+(FFTDataStorage.lastSeq + 1).toString(16) & 0xff) !== hexArr[1]) { // lost packet
							var lastPayload = FFTDataStorage.lastPayload;
							var lastOffset;
							if (lastPayload[6] & MASK_PAYLOAD_SENSOR_EXTMASK_MASSIVE_DATA_INFO) {
								lastOffset = translateInt32(lastPayload[29], lastPayload[30], lastPayload[31], lastPayload[32]) + lastPayload[4] - 28;
							} else {
								lastOffset = translateInt32(lastPayload[11], lastPayload[12], lastPayload[13], lastPayload[14]) + lastPayload[4] - 10;
							}

							if (logIndex != FFTDataStorage.logIndex) { // previous FFT Data lost packet and next FFT Data lost first packet
								var fillLength = (FFTDataStorage.bytesPerAxis * intAxisMaskEnable - 1) - lastOffset;
								var logIndex = FFTDataStorage.logIndex;

								var objData = {};
								objData.LOG_INDEX = logIndex;
								objData.BYTE_OFFSET = lastOffset;
								objData.LENGTH = fillLength;

								throw "FFT Data lost first packet.";
							}

							var fillLength = offset - lastOffset;
							var logIndex = FFTDataStorage.logIndex;

							lostPacketInfo.LOG_INDEX = logIndex;
							lostPacketInfo.BYTE_OFFSET = lastOffset;
							lostPacketInfo.LENGTH = fillLength;
						}
					}

					var timestamp = FFTDataStorage.timestamp;
					var logIndex = FFTDataStorage.logIndex;
					var sampleRate = FFTDataStorage.sampleRate;
					var points = FFTDataStorage.points;
					var bytesPerSample = FFTDataStorage.bytesPerSample;
					var samplesPerAxis = FFTDataStorage.samplesPerAxis;
					var bytesPerAxis = FFTDataStorage.bytesPerAxis;
					var totalLength = FFTDataStorage.totalLength;
					message.FFT.LOG_INDEX = logIndex;
					message.FFT.TIME = timestamp;
					message.FFT.SAMPLING_RATE = sampleRate;
					message.FFT.NUMBER_OF_SAMPLES = points;
					message.FFT.START_BYTE_OFFSET = offset;
					var axisData = {};
					for (var i=0; i<length/bytesPerSample; i++) {
						var axis = offset < bytesPerAxis ? axisType[0] : (offset < (bytesPerAxis * 2) ? axisType[1] : axisType[2]);
						var data = (bytesPerSample == 2) ? translateInt16(hexArr[index++], hexArr[index++]) : translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]);
						var sampleIndex = (offset % bytesPerAxis) / bytesPerSample; // by axis
						// sampleFreq = sampleIndex * sampling rate / number of samples
						var sampleFreq = sampleIndex * (sampleRate / points);

						if (typeof axisData[axis] == 'undefined') {
							axisData[axis] = {};
							axisData[axis].AXIS_TYPE = axis;
							axisData[axis].START_SAMPLE_INDEX = sampleIndex;
							axisData[axis].END_SAMPLE_INDEX = (offset % bytesPerAxis) >= ((initialOffset + length) % bytesPerAxis) ? (samplesPerAxis - 1) : (((initialOffset + length) % bytesPerAxis) / bytesPerSample) - 1;
							axisData[axis].DATA = [];
						}
						axisData[axis].DATA.push(data);

						offset += bytesPerSample;
						if (offset >= totalLength) {
							index = index + ((length/bytesPerSample - i - 1) * bytesPerSample);
							break;
						}
					}
					message.FFT.END_BYTE_OFFSET = offset - 1;
					message.FFT.AXIS_DATA = [];
					for (i in axisData) {
						message.FFT.AXIS_DATA.push(axisData[i]);
					}
					axisData = {};

					if (offset != (bytesPerAxis * intAxisMaskEnable)) {
						FFTDataStorage.lastSeq = hexArr[1];
						FFTDataStorage.lastPayload = hexArr;
					}
				}
				// TBD
				// if (extMask & MASK_PAYLOAD_SENSOR_EXTMASK_MASSIVE_DATA_LOG) {

				// }
			}
		}

		return index;
	}

	function deviceParse(index){
		var length;
		message.Device = {};
		index++;
		if (version > 0) {
			length = hexArr[index++];
		}
		mask = hexArr[index++];
		if (version > 0) length -= 1; // mask

		if(mask & MASK_DEVICE_EVENT){
			message.Device.Events = hexArr[index++];
			if (version > 0) length -= 1;
		}
		if(mask & MASK_DEVICE_POWER_SOURCE){
			message.Device.PowerSrc = hexArr[index++];
			if (version > 0) length -= 1;
		}
		if(mask & MASK_DEVICE_BATTERY_LEVEL){
			message.Device.BatteryLevel = hexArr[index++];
			if (version > 0) length -= 1;
		}
		if(mask & MASK_DEVICE_BATTERY_VOLTAGE){
			message.Device.BatteryVolt = translateInt16(hexArr[index++], hexArr[index++]);
			if (version > 0) length -= 2;
		}
		if(mask & MASK_DEVICE_TIMESTAMP){
			message.Device.Time = translateInt32(hexArr[index++], hexArr[index++], hexArr[index++], hexArr[index++]);
			if (version > 0) length -= 4;
		}
		if(mask & MASK_DEVICE_POSITION){
			message.Device.GNSS = {};
			var latitudeStr = "";
			var longitudeStr = "";
			if(hexArr[index] & MASK_DEVICE_POSITION_LATITUDE){
				latitudeStr = "S";
			}else{
				latitudeStr = "N";
			}
			if(hexArr[index] & MASK_DEVICE_POSITION_LONGITUDE){
				longitudeStr = "W";
			}else{
				longitudeStr = "E";
			}
			index++;

			message.Device.GNSS.Latitude = (translateInt24(hexArr[index++], hexArr[index++], hexArr[index++]) / 100000).toFixed(5) + ' ' + latitudeStr;
			message.Device.GNSS.Longitude = (translateInt24(hexArr[index++], hexArr[index++], hexArr[index++]) / 100000).toFixed(5) + ' ' + longitudeStr;
			if (version > 0) length -= 7;
		}

		if (version > 0) {
			if (length > 0) {
				index += length;
			}
		}

		return index;
	}

	function coilParse(index){
		var length;
		var mask = hexArr[index++] & 0x07;

		if (version > 0) {
			length = hexArr[index++];
		}

		var channel = hexArr[index++];
		if (version > 0) length -= 1; // port and channel index
		var port = (channel & 0x80) >> 7;

		if (mask & MASK_PAYLOAD_COIL_MULTI_CH) {
			var infoLen = channel & 0x7F;
			var recordLen = hexArr[index++];
			var dataMask = hexArr[index++];
			var i, j, k, maskGroup, chMask, ch = 0;
			var isSupportStatus = ((dataMask & MASK_PAYLOAD_COIL_STATUS) == MASK_PAYLOAD_COIL_STATUS);
			var isSupportData = ((dataMask & MASK_PAYLOAD_COIL_VALUE) == MASK_PAYLOAD_COIL_VALUE);

			for (i = 1; i <= infoLen - 2; i++) {
				maskGroup = hexArr[index++];
				i++;
				for (j = 0; j < 7; j++) {
					if ((maskGroup & (1 << j)) == 0) {
						ch += 8;
						continue;
					}
					chMask = hexArr[index++];
					i++;
					for (k = 0; k < 8; k++) {
						if ((chMask & (1 << k)) == 0) {
							ch += 1;
							continue;
						}
						message['RtuCoil'+port+'-'+ch] = {};
						ch += 1;
					}
				}
			}
			if (version > 0) length -= infoLen;

			for (i = 0; i < ch; i++) {
				if ((typeof message['RtuCoil'+port+'-'+i]) != 'undefined') {
					if (isSupportStatus) {
						message['RtuCoil'+port+'-'+i].Status = hexArr[index++];
						if (version > 0) length -= 1;
					}
					if (isSupportData) {
						message['RtuCoil'+port+'-'+i].Data = hexArr[index++];
						if (version > 0) length -= 1;
					}
				}
			}
		} else {
			var channelIndex = channel & 0x7F;

			message['RtuCoil'+port+'-'+channelIndex] = {};

			if (mask & MASK_PAYLOAD_COIL_STATUS) {
				message['RtuCoil'+port+'-'+channelIndex].Status = hexArr[index++];
				if (version > 0) length -= 1;
			}
			if (mask & MASK_PAYLOAD_COIL_VALUE) {
				message['RtuCoil'+port+'-'+channelIndex].Data = hexArr[index++];
				if (version > 0) length -= 1;
			}
		}

		if (version > 0) {
			if (length > 0) {
				index += length;
			}
		}

		return index;
	}

	function registerParse(index){
		var length;
		var mask = hexArr[index++] & 0x07;

		if (version > 0) {
			length = hexArr[index++];
		}

		var channel = hexArr[index++];
		if (version > 0) length -= 1; // port and channel index
		var port = (channel & 0x80) >> 7;

		if (mask & MASK_PAYLOAD_REGISTER_MULTI_CH) {
			var infoLen = channel & 0x7F;
			var recordLen = hexArr[index++];
			var dataMask = hexArr[index++];
			var i, j, k, maskGroup, chMask, ch = 0;
			var isSupportStatus = ((dataMask & MASK_PAYLOAD_REGISTER_STATUS) == MASK_PAYLOAD_REGISTER_STATUS);
			var isSupportData = ((dataMask & MASK_PAYLOAD_REGISTER_VALUE) == MASK_PAYLOAD_REGISTER_VALUE);

			for (i = 1; i <= infoLen - 2; i++) {
				maskGroup = hexArr[index++];
				i++;
				for (j = 0; j < 7; j++) {
					if ((maskGroup & (1 << j)) == 0) {
						ch += 8;
						continue;
					}
					chMask = hexArr[index++];
					i++;
					for (k = 0; k < 8; k++) {
						if ((chMask & (1 << k)) == 0) {
							ch += 1;
							continue;
						}
						message['RtuRegister'+port+'-'+ch] = {};
						ch += 1;
					}
				}
			}
			if (version > 0) length -= infoLen;

			for (i = 0; i < ch; i++) {
				if ((typeof message['RtuRegister'+port+'-'+i]) != 'undefined') {
					if (isSupportStatus) {
						message['RtuRegister'+port+'-'+i].Status = hexArr[index++];
						if (version > 0) length -= 1;
					}
					if (isSupportData) {
						message['RtuRegister'+port+'-'+i].Data = translateInt16(hexArr[index++], hexArr[index++]);
						if (version > 0) length -= 2;
					}
				}
			}
		} else {
			var channelIndex = channel & 0x7F;

			message['RtuRegister'+port+'-'+channelIndex] = {};

			if (mask & MASK_PAYLOAD_REGISTER_STATUS) {
				message['RtuRegister'+port+'-'+channelIndex].Status = hexArr[index++];
				if (version > 0) length -= 1;
			}
			if (mask & MASK_PAYLOAD_REGISTER_VALUE) {
				message['RtuRegister'+port+'-'+channelIndex].Data = translateInt16(hexArr[index++], hexArr[index++]);
				if (version > 0) length -= 2;
			}
		}

		if (version > 0) {
			if (length > 0) {
				index += length;
			}
		}

		return index;
	}

	function parsePayLoad(index){
		//DI
		if((hexArr[index] & 0xF0) === PAYLOAD_DI_DATA){
			index = DIParse(index);

			if (index < (arrLength - 1)) { // 1: ignore CRC
				parsePayLoad(index);
				return;
			} else { // Finish DI Parsing.
				return;
			}
		}

		//DO
		else if((hexArr[index] & 0xF0) === PAYLOAD_DO_DATA){
			index = DOParse(index);

			if (index < (arrLength - 1)) { //1: ignore CRC
				parsePayLoad(index);
				return;
			} else { // Finish DO Parsing.
				return;
			}
		}

		//AI
		else if((hexArr[index] & 0xF0) === PAYLOAD_AI_DATA){
			index = AIParse(index);

			if (index < (arrLength - 1)) { //1: ignore CRC
				parsePayLoad(index);
				return;
			} else { // Finish AI Parsing.
				return;
			}
		}

		//Sensor Type
		else if((hexArr[index] & 0xF0) === PAYLOAD_SENSOR_DATA){
			index = sensorParse(index);

			if (index < (arrLength - 1)) { //1: ignore CRC
				parsePayLoad(index);
				return;
			} else { //Finish Sensor Parsing.
				return;
			}
		}

		//Device Status
		else if((hexArr[index] & 0xF0) === PAYLOAD_DEVICE_DATA){
			index = deviceParse(index);

			if (index < (arrLength - 1)) { //1: ignore CRC
				parsePayLoad(index);
				return;
			} else { // Finish Device Parsing.
				return;
			}
		}

		//Coil Data
		else if((hexArr[index] & 0xF0) === PAYLOAD_COIL_DATA){
			index = coilParse(index);

			if (index < (arrLength - 1)) { //1: ignore CRC
				parsePayLoad(index);
				return;
			} else { // Finish Coil Parsing.
				return;
			}
		}

		//Register Data
		else if((hexArr[index] & 0xF0) === PAYLOAD_REGISTER_DATA){
			index = registerParse(index);

			if (index < (arrLength - 1)) { //1: ignore CRC
				parsePayLoad(index);
				return;
			} else { // Finish Register Parsing.
				return;
			}
		}
	}

	function getSourceAddressLength(address)
	{
		var addressLength = 0;

		if(address != "" && address != null){
			addressLength = address.length / 2;
		}

		return addressLength;
	}

	function checkFrameLength()
	{
		var addressLength = getSourceAddressLength(message.SourceAddress);

		if((message.TotalLength + addressLength + 4) != arrLength){ //4: Frame control + Sequence number + length + CRC
			return false;
		}else{
			return true;
		}
	}

	function CrcCalc(u8Arr, u16Length)
	{
		var  u16i;
		var u8CRC = 0xFF;

		for (u16i = 0; u16i < u16Length; u16i++)
		{
			u8CRC = au8CRC8_Pol07_Table[u8CRC ^ u8Arr[u16i]];
		}
		return u8CRC;
	}

    function checkPayloadLength(hexArr)
	{
		var sourceAddressLen = 0;
		if((hexArr[0] & MASK_HEADER_ADDRESS_MODE) === MASK_HEADER_ADDRESS_2_OCTECT){
			sourceAddressLen = 2;
		}else if((hexArr[0] & MASK_HEADER_ADDRESS_MODE) === MASK_HEADER_ADDRESS_8_OCTECT){
			sourceAddressLen = 8;
		}
		// (Octet)packet length - Frame Control - Frame Sequence Number - Total Length - Source Address - CRC !== payload length
		if (hexArr.length - 1 - 1 - 1 - sourceAddressLen - 1 !== hexArr[2]) {
			return false;
		} else {
			return true;
		}
	}

    ////////////////////////
    // Main
    ////////////////////////
    try {
        if (input == undefined || input.bytes == undefined) {
            return {
				data: {
                	payload: "Error: No data is received"
				}
            };
        }

        hexArr = input.bytes;

        if (hexArr.length < MIN_FRAME_LENGTH){
            return {
				data: {
                	payload: "received frame length error"
				}
            };
		}

        // check frame structure version
		version = (hexArr[0] & MASK_HEADER_FRAME_VERSION);

        //check if this is first segment
		if(!(hexArr[0] & MASK_HEADER_FIRST_SEGMENT)){
            return {
				data: {
                	payload: "fragmentation message, please use higher transmission data rate on your device"
				}
            };
		}else{
			if (!checkPayloadLength(hexArr)) {
				return {
					data: {
                    	payload: "fragmentation message, please use higher transmission data rate on your device"
					}
                };
			}
		}

        arrLength = hexArr.length;
        // get sequence number
		message.SequenceNumber = hexArr[++arrayIndex];
		// get payload length
		message.TotalLength = hexArr[++arrayIndex];

        var sourceAddress = "";

        // check WHDR header: source address
		if((hexArr[0] & MASK_HEADER_ADDRESS_MODE) === MASK_HEADER_ADDRESS_NONE){ //No source address
			arrayIndex++;
			message.SourceAddress = null;
		}else if((hexArr[0] & MASK_HEADER_ADDRESS_MODE) === MASK_HEADER_ADDRESS_2_OCTECT){ //2 octects source address
			arrayIndex++;
			for(i = arrayIndex; i < (arrayIndex+2); i++){
				sourceAddress = sourceAddress + addZero(hexArr[i].toString(16));
			}
			message.SourceAddress = sourceAddress;
			arrayIndex += 2;
		}else if((hexArr[0] & MASK_HEADER_ADDRESS_MODE) === MASK_HEADER_ADDRESS_8_OCTECT){ //8 octects source address
			arrayIndex++;
			for(i = arrayIndex; i < (arrayIndex+8); i++){
				sourceAddress = sourceAddress + addZero(hexArr[i].toString(16));
			}
			message.SourceAddress = sourceAddress;
			arrayIndex += 8;
		}

        // check CRC
		hexPayloadArr = hexArr.slice(3 + getSourceAddressLength(message.SourceAddress), hexArr.length - 1);
		var calculateCRC = CrcCalc(hexPayloadArr, hexPayloadArr.length);
		if (version > 0) {
			calculateCRC = ~calculateCRC & 0xff; // JavaScript bitwise operators are converted to signed 32-bit integers
		}

		if(calculateCRC != hexArr[hexArr.length-1]){
            return {
                data: {
                    payload: "Frame CRC check failed."
                }
            };
		}

        // check if frame legnth is correct
		if(message.SourceAddress != null && !checkFrameLength()){
			return {
                data: {
                    payload: "Frame length error"
                }
            };
		}

		// Parse Payload
		parsePayLoad(arrayIndex);
    } catch(ex) {
        return {
			data: {
            	payload: "Error: Parser failed. " + ex
			}
        };
    }

    ////////////////////////
    // Return data
    ////////////////////////
    return {
        data: {
            payload: message
        }
    };
}