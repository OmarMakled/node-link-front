import * as d3 from "d3";
export default {
  draw(nodes, links, vue) {
    // set up SVG for D3
    const width = 500;
    const height = 500;
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select('body')
      .append('svg')
      .on('contextmenu', () => {
        d3.event.preventDefault();
      })
      .attr('width', width)
      .attr('height', height);

    let path = svg.append('svg:g').selectAll('path');
    let circle = svg.append('svg:g').selectAll('g');

    // init D3 force layout
    const force = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2))
      .on('tick', tick);


    // update force layout (called automatically each iteration)
    function tick() {
      // draw directed edges with proper padding from node centers
      path.attr('d', (d) => {
        const deltaX = d.target.x - d.source.x;
        const deltaY = d.target.y - d.source.y;
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normX = deltaX / dist;
        const normY = deltaY / dist;
        const sourcePadding = d.direction === 'left' ? 17 : 12;
        const targetPadding = d.direction === 'right' ? 17 : 12;
        const sourceX = d.source.x + (sourcePadding * normX);
        const sourceY = d.source.y + (sourcePadding * normY);
        const targetX = d.target.x - (targetPadding * normX);
        const targetY = d.target.y - (targetPadding * normY);

        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      });

      circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
    }

    // define arrow markers for graph links
    svg.append('svg:defs').append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 6)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#000');

    svg.append('svg:defs').append('svg:marker')
      .attr('id', 'start-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 4)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M10,-5L0,0L10,5')
      .attr('fill', '#000');

    path = path
      .data(links)
      .style('marker-start', (d) => d.direction === 'left' ? 'url(#start-arrow)' : '')
      .style('marker-end', (d) => d.direction === 'right' ? 'url(#end-arrow)' : '')
      .enter()
      .append('svg:path')
      .attr('class', 'link')
      .style('marker-start', (d) => d.direction === 'left' ? 'url(#start-arrow)' : '')
      .style('marker-end', (d) => d.direction === 'right' ? 'url(#end-arrow)' : '')
      .merge(path);
    circle = circle.data(nodes, (d) => d.id);
    const g = circle.enter().append('svg:g');
    g.append('svg:circle')
      .attr('class', 'node')
      .attr('r', 12)
      .style('fill', (d) => colors(d.id))
      .style('stroke', (d) => d3.rgb(colors(d.id)).darker().toString())
      .on('click', (d) => {
        vue.$emit('onCircleClick', d.id)
      })
    g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .text((d) => d.name);
    circle = g.merge(circle);
    force
      .nodes(nodes)
      .force('link').links(links);

  }
};