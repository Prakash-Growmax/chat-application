import { FileSliders } from 'lucide-react';
export default function MyFiles(){
    return(
        <div className="flex items-center gap-3 rounded-lg hover:bg-gray-200 cursor-pointer px-4 py-2" style={{marginTop:"4px"}}>
              <FileSliders size={20} color='#64748B'/>  
                <p className="font-inter text-slate-500 lg:text-[15px] md:text-[18px] text-[18px] leading-[16px]">
  My File
</p>
        </div>

    )
}
