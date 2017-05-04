
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateExampleNumbers() {
  var firstNum = getRandomInt(6, 10);
  var secondNum = getRandomInt(11 - firstNum, 15 - firstNum);
  return [firstNum, secondNum];
}

function setExampleNumbers(firstNum, secondNum) {
  $('#first-num').text(firstNum);
  $('#second-num').text(secondNum);
}

function drawCurve (firstRefPoint, secondRefPoint, curveHeight, canvas) {
    var context = canvas.getContext("2d");
    var canvasHeight = canvas.height;
    context.lineWidth = 2;
    context.strokeStyle = '#b95483'
    context.moveTo(firstRefPoint, canvasHeight);
    var smoothness = (secondRefPoint - firstRefPoint) / 8;
    context.bezierCurveTo(firstRefPoint + smoothness,
                          curveHeight,
                          secondRefPoint - smoothness,
                          curveHeight,
                          secondRefPoint,
                          canvasHeight);
    context.stroke();
}

$(document).ready(function () {
    var numbers = generateExampleNumbers();
    var firstNum = numbers[0];
    var secondNum = numbers[1];
    var resultNum = firstNum + secondNum;
    setExampleNumbers(firstNum, secondNum);

    var scale = 39;
    var firstPoint = 0;
    var secondPoint = firstNum * scale;
    var thirdPoint = secondNum * scale + secondPoint;

    var canvas = document.getElementById("canvas");
    var canvasHeight = canvas.height;

    var firstCurveHeight = canvasHeight - (secondPoint - firstPoint) / 3;
    var secondCurveHeight = canvasHeight - (thirdPoint - secondPoint) / 3;

    function setPosition(object, left, bottom) {
      object.css({
        'position':'relative',
        'left' : left,
        'bottom': bottom,
      });
      return object;
    };
    setPosition($('#number1'),
      secondPoint / 2 - 393,
      -firstCurveHeight - 5
    );
    setPosition($('#number2'),
      (thirdPoint - secondPoint) / 2
      + secondPoint - 411,
      -secondCurveHeight - 5
    );

    drawCurve(firstPoint, secondPoint, firstCurveHeight, canvas);

    $('#number1').on('keyup', function() {
      var enteredNumber = +$(this).val();
      var requiredNumber = +$('#first-num').text();

      if (enteredNumber === requiredNumber) {
        $('#number2').fadeIn();
        $(this).remove();
        $('#input-layer').prepend(
            setPosition($('<span>'+ enteredNumber +'</span>'),
              secondPoint / 2 - 393, -firstCurveHeight - 5)
              .css('font-size', '18pt')
        );
        drawCurve(secondPoint, thirdPoint, secondCurveHeight, canvas);
        $('#first-num').css('background-color', 'white');
      } else {
        $(this).css('color', 'red');
        $('#first-num').css({
          'background-color': 'orange'
        });
      }
    });

    $('#number2').on('keyup', function() {
        var enteredNumber = +$(this).val();
        var requiredNumber = +$('#second-num').text();

        if (enteredNumber === requiredNumber) {
          $('#result').fadeIn();
          $(this).remove();
          $('#input-layer').append(
            setPosition($('<span>'+ enteredNumber +'</span>'),
              (thirdPoint - secondPoint) / 2 + secondPoint - 411,
              -secondCurveHeight - 5)
              .css('font-size', '18pt')
          );
          $('#second-num').css('background-color', 'white');
          $('#result-num').remove();
        } else {
          $(this).css('color', 'red');
          $('#second-num').css({
            'background-color': 'orange'
          });
        }
    });

    $('#result').on('keyup', function() {
        if ($(this).val().length === resultNum.toString().length) {
          if (+$(this).val() === resultNum) {
            $(this).remove();
            $("#example").append($('<span>' + $(this).val() + '</span>'));
          } else {
            $(this).css('color', 'red');
          }
        }
    });
});
