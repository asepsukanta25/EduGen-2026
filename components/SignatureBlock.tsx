
import React from 'react';
import { SignatureData } from '../types';

interface Props {
  data: SignatureData;
}

const SignatureBlock: React.FC<Props> = ({ data }) => {
  return (
    <div className="mt-16 text-slate-800 page-break-avoid border-t pt-8 border-slate-100">
      <div className="grid grid-cols-2 gap-10 text-center">
        {/* Kolom Kiri: Kepala Sekolah */}
        <div className="flex flex-col items-center">
          <div className="h-14 flex flex-col justify-end">
            <p className="font-bold">Mengetahui,</p>
            <p className="font-bold">Kepala Sekolah</p>
          </div>
          <div className="mt-16">
            <p className="font-bold underline">
              {data.principalName || '( ...................................... )'}
            </p>
            <p className="text-sm">NIP. {data.principalNip || '......................................'}</p>
          </div>
        </div>
        
        {/* Kolom Kanan: Guru Kelas dengan Kota/Tanggal di atasnya */}
        <div className="flex flex-col items-center">
          <div className="h-14 flex flex-col justify-end">
            <p className="text-sm mb-1">
              {data.city || '...................'}, {data.date || '...................'}
            </p>
            <p className="font-bold">Guru Kelas</p>
          </div>
          <div className="mt-16">
            <p className="font-bold underline">
              {data.teacherName || '( ...................................... )'}
            </p>
            <p className="text-sm">NIP. {data.teacherNip || '......................................'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureBlock;
