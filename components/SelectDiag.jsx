import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDiagram() {
  return (
    <Select>
      <SelectTrigger className="w-[12rem] bg-white rounded-[0.2rem] shadow-none">
        <SelectValue placeholder="Diagram type" />
      </SelectTrigger>
      <SelectContent className='rounded-[0.2rem] shadow-none w-[12rem]'>
        <SelectGroup>
          <SelectItem value="graphviz" className='text-[0.85rem]'>GraphViz</SelectItem>
          <SelectItem value="plantuml" className='text-[0.85rem]'>PlantUML</SelectItem>
          <SelectItem value="mermaid" className='text-[0.85rem]'>Mermaid</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
