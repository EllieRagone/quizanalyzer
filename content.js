// content.js
//

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message === "clicked_browser_action") {
        run();
      }
    }
);
var run = function() {
  questions = [];
  $('.reviewQuestions').each(function(index, el) {  
    $(el).find('.questionDisplay').each(function(index, ele) {  
      choices = [];
      $(ele).find('.questionTypeDisplay table tr').each(function(a,b) {  
        if ($.trim($(b).text()) != "") choices.push($.trim($(b).text()));
      });

      var data = {  
        "question": $.trim($(ele).find('.reviewQuestionText').text()), 
        "choices": choices, 
        "explanation": $.trim($(ele).find('.questionSection.reviewExpand.feedbackDisplay').text()), 
        "answer": $.trim($(ele).find('table tr').filter(function(index, elem) {  
          if ($(elem).find('img[src="ui/common/images/PortletImages/Icons/score-notscored.png"]').length == 1 || $(elem).find('td.correct').length == 1 || $(elem).find('img[src="ui/common/images/PortletImages/Icons/16/tick.png"]').length == 1) {  
            return true;
          };
        }).text())
      };
      if ($(ele).find('table tr td.correct, table tr td.incorrect').length > 0) {
        // console.log('found correct or incorrect');
        var rows = $(ele).find('table tr');

        if ($(rows).find('td.correct').length > 0) {
          // console.log('found correct');
          // console.log($(rows).find('td.correct').parent().text().replace('Correct', '').trim());
          data['answer'] = $(rows).find('td.correct').parent().text().replace('Correct', '').trim();
        }

        if ($(rows).find('td.incorrect').length > 0) {
          // console.log('found incorrect');
          // console.log($(rows).find('td.incorrect').parent().siblings().text().trim());
          data['answer'] = $(rows).find('td.incorrect').parent().siblings().text().trim();
        }
      }
      questions.push(data)
    });
  });
  var csv_data = JSONToCSVConvertor(questions, "questions", true);
  // copyToClipboard(csv_data);
};

copyToClipboard = function(text){
  var copyDiv = document.createElement('div');
  copyDiv.contentEditable = true;
  document.body.appendChild(copyDiv);
  copyDiv.innerHTML = text;
  copyDiv.unselectable = "off";
  copyDiv.focus();
  document.execCommand('SelectAll');
  document.execCommand("Copy", false, null);
  document.body.removeChild(copyDiv);
}
