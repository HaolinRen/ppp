
(function() {
 "use strict"
  var lpt_util = {
    existID : [],
    lenID : 5,
    getRandomID : function() {
      var res;
      do {
        res = this.generateID();
      } while(this.existID.indexOf(res) != -1);
      this.existID.push(res);
      return res;
    },
    generateID : function() {
      var res = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      var pl = possible.length;
      for (var i = 0; i < this.lenID; i += 1) {
        res += possible.charAt(Math.random() * pl);
      }
      return res;
    },
    giveRanColor : function() {
      var cList = ['red', 'orange','yellow','olive','green','teal','blue','violet','purple','pink','brown'];
      var cLen = cList.length;
      var cp = Math.floor(Math.random() * cLen);
      return cList[cp];
    },
    postData : function(async, url, data, callback) {
      this.postData_o(async, url, 'application/json', data, (d)=>{
        // try {
          var res = JSON.parse(d);
          if (res.code === '0') {

            callback(res.data);
          }
        // } catch (e) {
        //   callback({});
        //   throw 'wrong json format';
        // }
      })
    },
    postBinaryData : function(async, url, data, callback) {
      this.postData_o(async, url, 'application/cotet-steam', dta, callback);
    },
    postData_o: function(async, url, contType, data, callback) {
      $.ajax({
        async: async,
        type: 'POST',
        url: url,
        contentType: contType,
        data: data,
        success: function (resData) {
          callback(resData);
        },
        error: function (resData) {
          console.log(resData.statusText);
        }
      })
    },
    addOption: function(path) {
      var content = [];
      this.postData(false, '/data', path, function(data) {
        var dlen = data.length;
        for (let i = 0; i < dlen; i += 1) {
          content.push(data[i].label);
        }
      });
      return this.generateOptions(content);
    },
    generateOptions : function(arr) {
      var res = '';
      var clen = arr.length;
      var t0 = '<div class="item" data-value="';
      for (let i = 0; i < clen; i += 1) {
        res += t0 + i + '">' + arr[i] + '</div>';
      }
      return res;
    },
    customSelect : function(options, title, isMultiple, header) {
      var opts = this.generateOptions(options);
      return this.generateSelect(opts, title, isMultiple, header);
    },
    generateSelect : function(options, title, isMultiple, header) {
      var tempValue;
      if (isMultiple) {
        tempValue = 'multiple';
      } else {
        tempValue = ''
      }
      var dHeader;
      if (header) {
        dHeader = '<div class="ui sub header">' +  header + '</div>';
      } else {
        dHeader = ''
      }
      var re = dHeader + '<div class="ui ' + tempValue + ' search selection dropdown">' +
        '<input type="hidden">' +
        '<i class="dropdown icon"></i>' +
        '<div class="default text blue">' + title + '</div>' +
        '<div class="menu">' + options + '</div></div></div>';
      return re;
    },
    createSelect : function(path, title, isMultiple, header) {
      var opts = this.addOption(path);
      return this.generateSelect(opts, title, isMultiple, header);
    },
    addHeader : function(icon, title) {
      var header = '<h4 class="ui header"><i class="' + icon + ' icon"></i>' +
              '<div class="content">' + title + '</div></h4>' +
              '<div class="ui divider"></div>';
      return header;
    },
    
    addMultiCheckBox: function(title, boxes) {
      var re = '<div class="ui hidden divider">'+ title +'</div><div class="item"><div class="list">';
      var s0 = '<div class="item"><div class="ui checkbox"><input type="checkbox"><label>';
      var s1 = '</label></div></div>';
      for (let i = 0; i < boxes.length; i += 1) {
        re += s0 + boxes[i].title + s1;
      }
      re += '</div></div>';
      return re;
    },
    addRadioCheckBox : function(boxes, format) {
      var re = '<div class="ui form "><div class="' + format + ' list">';
      var randID = this.getRandomID();
      for (let one in boxes) {
        re += '<div class="list"><div class="ui radio checkbox"><input type="radio" name="';
        re += randID + '"';
        if (boxes[one].isChecked) {
          re += ' checked="checked"';
        }
        re += ' value="' + one + '"'
        re += '><label>' + boxes[one].title + '</label></div></div>';
      }
      re += '</div></div>';
      return {id: randID, data: re};
    },
    addComma : function(val) {
      var targ = val.toString().split('');
      var res = [];
      var tl = targ.length;
      if (tl <= 3) {
        return targ.join('');
      } else {
        var beginPosi = tl % 3;
        if (beginPosi === 0) {
          beginPosi = 3;
        }
        for (let i = 0; i < beginPosi; i += 1) {
          res[i] = targ[i];
        }
        for (let i = beginPosi; i < tl; i += 1) {
          if ((i-beginPosi) % 3 === 0) {
            res.push(',');
          }
          res.push(targ[i]);
        }
      }
      return res.join('');
    },
    extendInstance : function (child, parent) {
        let F = function() {};
        F.prototype = parent.prototype;
        child.prototype = new F();
        child.prototype.constructor = child;
        child.prototype.uber = parent.prototype;
    },
    downloadFile: function(fileType, fileName, fileData) {
      if (false && window.navigator.msSaveBlob) {
        var blob = new Blob([decodeURIComponent(fileData)], {
          type: 'text/'+ fileType +';charset=utf-8'
        });

      window.navigator.msSaveBlob(blob, fileName);

      } else if (window.Blob && window.URL) {
        // HTML5 Blob        
        var blob = new Blob([fileData], {
          type: 'text/' + fileType + ';charset=utf-8'
        });
        var dataUrl = URL.createObjectURL(blob);

        $(this).attr({
          'download': fileName,
          'href': dataUrl,
          'target': '_blank'
        });
      } else {
        var dataToDownload = 'data:application/' + fileType + ';charset=utf-8,' + encodeURIComponent(fileData);

        $(this)
          .attr({
            'download': fileName,
            'href': dataToDownload,
            'target': '_blank'
          });
      }
    },
    getTimeStep: function() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
          month = '0' + month
        }
        let day = date.getDate();
        if (day < 10) {
          day = '0' + day;
        }
        let hour = date.getHours();
        if (hour < 10) {
          hour = '0' + hour;
        }
        let minutes = date.getMinutes();
        if (minutes < 10) {
          minutes = '0' + minutes;
        }

        let formattedTime = year + month + day + hour + minutes;
        return formattedTime;
    },
    CSVToArray: function(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
          (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
          ),
          "gi"
        );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {

          // Get the delimiter that was found.
          var strMatchedDelimiter = arrMatches[1];

          // Check to see if the given delimiter has a length
          // (is not the start of string) and if it matches
          // field delimiter. If id does not, then we know
          // that this delimiter is a row delimiter.
          if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
          ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

          }

          var strMatchedValue;

          // Now that we have our delimiter out of the way,
          // let's check to see which kind of value we
          // captured (quoted or unquoted).
          if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
              new RegExp("\"\"", "g"),
              "\""
            );

          } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];

          }


          // Now that we have our value string, let's add
          // it to the data array.
          arrData[arrData.length - 1].push(strMatchedValue);
        }

        // Return the parsed data.
        let lg = arrData[0].length;
        let arrLg = arrData;
        let res = [];
        for (let oneLine of arrData) {
          if (oneLine.length === lg) {
            res.push(oneLine)
          }
        }
        return (res);
      }
    };

  window.lpt_util = lpt_util;
})(window);

