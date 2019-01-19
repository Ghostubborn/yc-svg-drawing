SVG.on(document, 'DOMContentLoaded', function () {
  if (SVG.supported) {
    var width = 1200;
    var height = 800;
    var startPosition = { x: 50, y: 0 }

    var info = {
      rect: {
        first: { width: 150, height: 50, margin: 100, fill: '#800000' },
        others: { width: 150, height: 40, margin: 100, fill: '#0F3763' }
      }
    };

    var data = window.ycData;
    var draw = SVG('handmade').size(width, height);
    draw.style({ background: '#ccf' })

    var domStructure = [];

    for (var i = 0; i < data.length; i++) {
      domStructure.push([])
      if (i === 0) {
        domStructure[i].rectInfo = info.rect.first;
      } else {
        domStructure[i].rectInfo = info.rect.others;
      }
      domStructure[i].rect = draw.rect(domStructure[i].rectInfo.width, domStructure[i].rectInfo.height);
      domStructure[i].rect.radius(domStructure[i].rectInfo.height / 2);
      domStructure[i].rect.attr({
        x: startPosition.x + i * (domStructure[i].rectInfo.width + domStructure[i].rectInfo.margin),
        y: (height - domStructure[i].rectInfo.height) / 2
      });
      domStructure[i].rect.style({ fill: domStructure[i].rectInfo.fill });

      domStructure[i].text = draw.text(data[i].name)
        .font({ size: '18px' })
        .fill('#fff')
        .cx(domStructure[i].rect.cx())
        .cy(domStructure[i].rect.cy());

      if (i > 0) {
        domStructure[i].line = draw.line(
          domStructure[i - 1].rect.cx() + domStructure[i - 1].rectInfo.width / 2,
          domStructure[i - 1].rect.cy(),
          domStructure[i].rect.cx() - domStructure[i].rectInfo.width / 2,
          domStructure[i].rect.cy()
        ).stroke({ width: 1 })
      }
    }
  } else {
    alert('浏览器不支持SVG')
  }
})
