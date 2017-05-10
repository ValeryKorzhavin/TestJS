
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

    var positionFirst = {
      x: secondPoint / 2 + 25,
      y: 80 + secondPoint / 3,
    };
    var positionSecond = {
      x: (thirdPoint - secondPoint) / 2 + secondPoint + 25,
      y: 80 + (thirdPoint - secondPoint) / 3,
    };
    function setPosition(object, position) {
      object.css({
        'left' : position.x,
        'bottom': position.y,
      });
      return object;
    };

    setPosition($('#number1'), positionFirst);
    setPosition($('#number2'), positionSecond);

    drawCurve(firstPoint, secondPoint, firstCurveHeight, canvas);

    function proccessInput(sourceNumber, inputNumber,
                           nextInputNumber, position, result) {
      return function () {
        var enteredNumber = +$(inputNumber).val();
        var requiredNumber = +$(sourceNumber).text();

        if (enteredNumber === requiredNumber) {
          $(nextInputNumber).fadeIn();
          $(inputNumber).after(
            setPosition(
              $('<span>'+ enteredNumber +'</span>')
              .attr({'class': 'result-numbers'}),
              position
            )
          );
          $(inputNumber).remove();
          drawCurve(secondPoint, thirdPoint, secondCurveHeight, canvas);
          $(sourceNumber).removeClass('wrong');
        } else {
          $(inputNumber).addClass('wrong-input');
          $(sourceNumber).addClass('wrong');
        }
        if (result) {
          $('#result-num').remove();
        }
      }
    }

    $('#number1').on('keyup',
    proccessInput('#first-num', '#number1', '#number2', positionFirst));

    $('#number2').on('keyup',
    proccessInput('#second-num', '#number2', '#result', positionSecond, true));

    $('#result').on('keyup', function() {
        if ($(this).val().length === resultNum.toString().length) {
          if (+$(this).val() === resultNum) {
            $(this).remove();
            $("#example").append($('<span>' + $(this).val() + '</span>'));
          } else {
            $(this).addClass('wrong-input');
          }
        }
    });
});
