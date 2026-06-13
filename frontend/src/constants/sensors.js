export const SENSORS = [
  {
    key:'2', id:'MQ-2', label:'Gas inflamable & humo', status:'Seguro', statusClass:'s-safe',
    color:'#2563EB', badgeBg:'rgba(37,99,235,.07)', badgeBorder:'rgba(37,99,235,.16)',
    compact:false, W:400, H:64, N:52, initVal:247, min:100, max:490, step:28, interval:1800, phaseOffset:0,
  },
  {
    key:'3', id:'MQ-3', label:'Alcohol', status:'Alerta', statusClass:'s-alert',
    color:'#0A8F5F', badgeBg:'rgba(10,143,95,.07)', badgeBorder:'rgba(10,143,95,.16)',
    compact:true, W:200, H:48, N:32, initVal:83, min:18, max:260, step:13, interval:2060, phaseOffset:2.3,
  },
  {
    key:'4', id:'MQ-4', label:'Metano', status:'Precaución', statusClass:'s-warn',
    color:'#D97706', badgeBg:'rgba(217,119,6,.07)', badgeBorder:'rgba(217,119,6,.16)',
    compact:true, W:200, H:48, N:32, initVal:162, min:55, max:430, step:22, interval:2320, phaseOffset:4.6,
  },
];
