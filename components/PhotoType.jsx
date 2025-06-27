import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PhotoType({ value, onValueChange }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[12rem] bg-white rounded-[0.2rem] shadow-none">
        <SelectValue placeholder="Image format" />
      </SelectTrigger>
      <SelectContent className='rounded-[0.2rem] shadow-none w-[12rem]'>
        <SelectGroup>
          <SelectItem value="svg" className='text-[0.85rem]'>SVG</SelectItem>
          <SelectItem value="png" className='text-[0.85rem]'>PNG</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}