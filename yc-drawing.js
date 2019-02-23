SVG.on(document, 'DOMContentLoaded', function () {
  if (SVG.supported) {
    var width = 1600;
    var height = 900;
    var startPosition = { x: 50, y: 0 }
    var info = {
      rect: {
        firstOrLast: { width: 200, height: 50, margin: 100, fill: '#800000' },
        others: { width: 200, height: 40, margin: 100, fill: '#0F3763' }
      }
    };

    var data = window.ycData;
    var draw = SVG('handmade').size(width, height);
    // TODO: temp background color
    draw.style({ background: '#ccf' });

    var domStore = [];

    // root nodes loop
    for (var i = 0; i < data.length; i++) {
      domStore.push([]);
      if (i === 0 || i === data.length - 1) {
        domStore[i].rectInfo = info.rect.firstOrLast;
      } else {
        domStore[i].rectInfo = info.rect.others;
      }

      // draw root node
      domStore[i].rect = draw.rect(domStore[i].rectInfo.width, domStore[i].rectInfo.height);
      domStore[i].rect.radius(domStore[i].rectInfo.height / 2);
      domStore[i].rect.attr({
        x: startPosition.x + i * (domStore[i].rectInfo.width + domStore[i].rectInfo.margin),
        y: (height - domStore[i].rectInfo.height) / 2
      });
      domStore[i].rect.style({ fill: domStore[i].rectInfo.fill });
      domStore[i].text = draw.text(data[i].name)
        .font({ size: '18px' })
        .fill('#fff')
        .cx(domStore[i].rect.cx())
        .cy(domStore[i].rect.cy());

      // line between root nodes
      if (i > 0) {
        domStore[i].line = draw.line(
          domStore[i - 1].rect.cx() + domStore[i - 1].rectInfo.width / 2,
          domStore[i - 1].rect.cy(),
          domStore[i].rect.cx() - domStore[i].rectInfo.width / 2,
          domStore[i].rect.cy()
        ).stroke({ width: 1 })
      }

      // projects invested by nation
      for (var j = 0; j < data[i].nation.length; j++) {

      }
    }
  } else {
    alert('浏览器不支持SVG')
  }
})
