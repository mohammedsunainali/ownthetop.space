import { tokens } from "@/design/tokens";
/** Environmental accents, not replacements for the approved brand/ad tokens. */
export const cityArchetypes = [
  {id:"startup-glass",name:"Startup office",body:tokens.color.brand.lightBlue,roof:tokens.color.brand.blue,accent:tokens.color.brand.teal},
  {id:"warm-commercial",name:"Warm-stone commercial",body:"#EEE4D6",roof:"#B6C88A",accent:tokens.color.brand.summitGold},
  {id:"terracotta-home",name:"Terracotta residence",body:"#F0805B",roof:"#754B44",accent:tokens.color.brand.cream},
  {id:"garden-retail",name:"Garden retail",body:tokens.color.brand.cream,roof:"#B6C88A",accent:tokens.color.brand.teal},
  {id:"color-shop",name:"Colorful storefront",body:tokens.color.brand.peach,roof:tokens.color.brand.lavender,accent:tokens.color.brand.coral},
  {id:"contemporary-office",name:"Contemporary office",body:"#9AAECC",roof:"#142A47",accent:tokens.color.brand.blue},
  {id:"corner-cafe",name:"Corner cafe",body:"#F5D7A0",roof:"#D98B6A",accent:tokens.color.brand.teal},
  {id:"community",name:"Community building",body:tokens.color.brand.lavender,roof:tokens.color.brand.cream,accent:tokens.color.brand.summitGold},
] as const;
