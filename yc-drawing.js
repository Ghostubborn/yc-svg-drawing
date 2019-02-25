SVG.on(document, 'DOMContentLoaded', function () {
  if (SVG.supported) {
    // 画布大小
    var width = 1600;
    var height = 980;
    // 数据
    var data = window.ycData;

    // painting time
    var info = {
      rect: {
        firstOrLast: { width: 200, height: 50, fill: '#800000' },
        others: { width: 200, height: 40, fill: '#0F3763' }
      }
    };

    var draw = SVG('handmade').size(width, height);
    var totalBox;

    // root nodes loop
    var rectList = [];
    var textList = [];
    var start = { x: 50, cy: height / 2 };

    for (var i = 0; i < data.length; i++) {
      var rectInfo;
      if (i === 0 || i === data.length - 1) {
        rectInfo = info.rect.firstOrLast;
      } else {
        rectInfo = info.rect.others;
      }

      rectList.push(draw.rect(rectInfo.width, rectInfo.height));
      // draw root node
      rectList[i].radius(rectInfo.height / 2);
      if (i === 0) {
        rectList[i].attr({ x: start.x }).cy(start.cy);
      } else {
        rectList[i].attr({ x: rectList[i - 1].bbox().x2 + 50 }).cy(start.cy);
      }
      rectList[i].style({ fill: rectInfo.fill });
      textList.push(draw.text(data[i].name).font({ size: '18px' }).fill('#fff'));

      // line between root nodes
      if (i > 0) {
        drawLine(rectList[i].bbox().x, rectList[i].bbox().cy, rectList[i - 1].bbox().x2, rectList[i - 1].bbox().cy);
      }

      let nationBbox = drawList(
        formatProjectList(data[i].nation, true),
        rectList[i].bbox().x + 30,
        rectList[i].bbox().y,
        true,
        true,
      );
      let enterpriseBbox = drawList(
        formatProjectList(data[i].enterprise),
        rectList[i].bbox().x + 60,
        rectList[i].bbox().y2,
        false,
        true
      );
      
      // reset rect width
      let yearBbox = rectList[i].bbox();
      if (nationBbox) {
        yearBbox = yearBbox.merge(nationBbox);
      }
      if (enterpriseBbox) {
        yearBbox = yearBbox.merge(enterpriseBbox);
      }
      rectList[i].attr({ width: yearBbox.width });
      textList[i].cx(rectList[i].cx()).cy(rectList[i].cy());

      if (totalBox) {
        totalBox = totalBox.merge(yearBbox);
      } else {
        totalBox = yearBbox;
      }
    }

    // correct position and size
    draw.viewbox(totalBox.x - 50, totalBox.y, totalBox.width + 100, totalBox.height);

    function drawLine (x, y, x2, y2) {
      return draw.line(x, y, x2, y2).stroke({ width: 1 });
    }

    function drawText (x, y, text) {
      return text = draw.text(text).font({ size: '14px', weight: '400' }).x(x + 15).y(y);
    }

    function drawList (list, x, y, lowerFirst, isRoot) {
      if (!list || !list.length) {
        return false;
      }

      if (lowerFirst) {
        list.reverse();
      }

      let start = { x: x, y: lowerFirst ? y - 25 : y + 9 };
      let itemBboxList = []
      let mergedList = undefined;

      for (let i = 0; i < list.length; i++) {
        // draw text
        let hasChild = typeof list[i] === 'object';
        let text = drawText(start.x, start.y, hasChild ? list[i].text : list[i]);
        let childList;
        if (hasChild) {
          // draw list
          childList = drawList(
            list[i].children,
            text.bbox().x2 + 15,
            text.bbox().y + (lowerFirst ? 25 : 0),
            lowerFirst
          );
          // reset text y position
          text.cy(childList.cy);
          // draw line at right of text
          drawLine(text.bbox().x2 + 15, text.bbox().cy, text.bbox().x2 + 5, text.bbox().cy)
        }

        // draw line at left of text
        let leftLine = drawLine(text.bbox().x - 15, text.bbox().cy, text.bbox().x - 5, text.bbox().cy)

        // save whole item bbox
        if (childList) {
          itemBboxList.push(text.bbox().merge(childList).merge(leftLine.bbox()));
        } else {
          itemBboxList.push(text.bbox().merge(leftLine.bbox()));
        }

        // draw vertical line from current item to the previous one
        if (i > 0) {
          drawLine(itemBboxList[i].x, itemBboxList[i].cy, itemBboxList[i - 1].x, itemBboxList[i - 1].cy);
        } else if (isRoot) {
          drawLine(itemBboxList[i].x, itemBboxList[i].cy, x, y);
        }

        // set y position from where next item starts
        start.y = lowerFirst ? (itemBboxList[i].y - 25) : (itemBboxList[i].y2 + 9);

        // merge current item to list
        if (mergedList) {
          mergedList = mergedList.merge(itemBboxList[i]);
        } else {
          mergedList = itemBboxList[i];
        }
      }
      return mergedList;
    }

    function formatProjectList (data, isNation) {
      if (!data || !data.length) {
        return;
      }
      var keys = isNation ?
        ['name', 'supervisor', 'source', 'type', 'finance', 'details', 'timeRange'] :
        ['name', 'supervisor', 'partyA', 'type', 'contractAmount', 'details', 'timeRange'];
      return data.map((item, index) => {
        return {
          text: `${isNation ? '纵向研发' : '横向研发'} ${index + 1}`,
          children: keys.map(key => {
            if (key !== 'details') {
              return item[key];
            } else {
              return {
                text: '技术指标',
                children: item[key]
              }
            }
          })
        }
      })
    }
  } else {
    alert('浏览器不支持SVG')
  }
})
