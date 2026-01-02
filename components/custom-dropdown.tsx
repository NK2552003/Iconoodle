"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DropdownOption, CustomDropdownProps } from "@/lib/types"

export function CustomDropdown({ options, value, onChange, triggerClassName }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const [menuPos, setMenuPos] = React.useState<{ top: number; left: number } | null>(null)

  const menuRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const clickedOutsideTrigger = dropdownRef.current && !dropdownRef.current.contains(target)
      const clickedOutsideMenu = !(menuRef.current && menuRef.current.contains(target))
      if (clickedOutsideTrigger && clickedOutsideMenu) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  React.useEffect(() => {
    if (!isOpen) {
      setMenuPos(null)
      return
    }
    const el = dropdownRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const menuWidth = 192 // w-48
    const menuHeight = options.length * 40 + 8 // approximate height (py-1 + items)
    
    // Calculate horizontal position
    let left = rect.right - menuWidth
    if (left < 8) left = rect.left
    if (left + menuWidth > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - menuWidth - 8)
    }
    
    // Calculate vertical position with viewport constraint
    let top = rect.bottom + 8
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    
    // If not enough space below and more space above, open upward
    if (spaceBelow < menuHeight + 16 && spaceAbove > spaceBelow) {
      top = rect.top - menuHeight - 8
    }
    
    // Ensure menu stays within viewport
    if (top < 8) top = 8
    if (top + menuHeight > window.innerHeight - 8) {
      top = Math.max(8, window.innerHeight - menuHeight - 8)
    }
    
    setMenuPos({ top: Math.round(top + window.scrollY), left: Math.round(left + window.scrollX) })
  }, [isOpen, options.length])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center h-full px-2 transition-all border-l focus:outline-none",
          triggerClassName,
        )}
      >
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && menuPos && typeof window !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              style={{ 
                position: "absolute", 
                top: `${menuPos.top}px`, 
                left: `${menuPos.left}px`, 
                width: 192,
                maxHeight: 'calc(100vh - 16px)',
                overflowY: 'auto'
              }}
              className="bg-background border rounded-xl shadow-xl z-9999 py-1 animate-in fade-in zoom-in-95 duration-100"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    // call onChange inside a requestAnimationFrame to ensure our outside-click handler doesn't close the menu before the click
                    requestAnimationFrame(() => onChange(option.value))
                    setIsOpen(false)
                  }}
                  className="w-48 flex items-center justify-between px-4 py-2 text-sm hover:bg-muted transition-colors text-left"
                >
                  <span>{option.label}</span>
                  {value === option.value && <Check className="w-3 h-3 text-primary" />}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
