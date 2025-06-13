<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import * as d3 from 'd3';

  export let skills: string[] = [];
  
  let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  let container: HTMLDivElement;
  let width = 0;
  let height = 0;
  let simulation: d3.Simulation<Node, Link>;
  let resizeObserver: ResizeObserver;
  
  interface Node extends d3.SimulationNodeDatum {
    id: string;
    group: number;
    radius: number;
    width?: number;
    height?: number;
  }

  interface Link extends d3.SimulationLinkDatum<Node> {
    value: number;
  }

  function createNetworkData(skills: string[]) {
    const nodes: Node[] = skills.map((skill, i) => ({
      id: skill,
      group: i % 5,
      radius: 40 + Math.random() * 20
    }));

    const links: Link[] = [];
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        if (Math.random() > 0.5) {
          links.push({
            source: nodes[i],
            target: nodes[j],
            value: 1
          });
        }
      }
    }

    return { nodes, links };
  }

  function updateVisualization() {
    if (!svg || skills.length === 0 || !width || !height) return;

    const padding = 16; // Container padding
    const innerWidth = width - (padding * 2);
    const innerHeight = height - (padding * 2);

    const data = createNetworkData(skills);
    
    svg.selectAll("*").remove();

    // Measure text dimensions
    const tempText = svg.append("g")
      .style("visibility", "hidden")
      .selectAll("text")
      .data(data.nodes)
      .join("text")
      .text(d => d.id)
      .style("font-size", "12px");

    tempText.each(function(d) {
      const bbox = (this as SVGTextElement).getBBox();
      const padding = 4;
      d.width = bbox.width + padding;
      d.height = bbox.height + padding;
    });

    tempText.remove();

    // Create the simulation with dynamic forces based on container size
    simulation = d3.forceSimulation<Node>(data.nodes)
      .force("link", d3.forceLink<Node, Link>(data.links).id(d => d.id).distance(10))
      .force("charge", d3.forceManyBody().strength(-30))
      .force("center", d3.forceCenter(innerWidth / 2 + padding, innerHeight / 2 + padding).strength(1))
      .force("collision", d3.forceCollide<Node>().radius(d => {
        return Math.max(d.width || 20, d.height || 10) / 2;
      }).strength(1))
      .force("x", d3.forceX(innerWidth / 2 + padding).strength(0.2))
      .force("y", d3.forceY(innerHeight / 2 + padding).strength(0.2));

    // Simplified gradient
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "node-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(147, 51, 234, 0.9)");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(147, 51, 234, 0.7)");

    // Create links
    const link = svg.append("g")
      .selectAll<SVGLineElement, Link>("line")
      .data(data.links)
      .join("line")
      .style("stroke", "rgba(147, 51, 234, 0.2)")
      .style("stroke-width", 1);

    // Create nodes
    const node = svg.append("g")
      .selectAll<SVGGElement, Node>("g")
      .data(data.nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add rectangles
    node.append("rect")
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("x", d => -(d.width || 20) / 2)
      .attr("y", d => -(d.height || 10) / 2)
      .attr("width", d => d.width || 20)
      .attr("height", d => d.height || 10)
      .style("fill", "url(#node-gradient)")
      .style("opacity", 0.9);

    // Add labels
    node.append("text")
      .text(d => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("fill", "white")
      .style("font-size", "12px")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      // Keep nodes within bounds with padding
      node.attr("transform", d => {
        d.x = Math.max(padding + d.width! / 2, Math.min(width - padding - d.width! / 2, d.x!));
        d.y = Math.max(padding + d.height! / 2, Math.min(height - padding - d.height! / 2, d.y!));
        return `translate(${d.x},${d.y})`;
      });

      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);
    });
  }

  function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  function updateDimensions() {
    if (container) {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      if (svg) {
        svg.attr("width", width)
           .attr("height", height);
        
        if (simulation) {
          const padding = 16;
          simulation
            .force("center", d3.forceCenter(width / 2, height / 2).strength(1))
            .force("x", d3.forceX(width / 2).strength(0.2))
            .force("y", d3.forceY(height / 2).strength(0.2))
            .alpha(0.3)
            .restart();
        }
      }
    }
  }

  onMount(() => {
    svg = d3.select("#skill-network")
      .append("svg");
    
    resizeObserver = new ResizeObserver(() => {
      updateDimensions();
      updateVisualization();
    });
    
    resizeObserver.observe(container);
    updateDimensions();
    updateVisualization();

    return () => {
      resizeObserver?.disconnect();
    };
  });

  afterUpdate(() => {
    updateVisualization();
  });
</script>

<div 
  bind:this={container}
  id="skill-network" 
  class="mx-auto flex items-center justify-center h-96 rounded-xl bg-stone-900/25 backdrop-blur-sm overflow-hidden p-4"
>
</div>
