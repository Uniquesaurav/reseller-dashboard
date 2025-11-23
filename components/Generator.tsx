import React, { useState } from 'react';
import { Zap, Loader2, AlertTriangle, Calendar, Tv, Music, Video, Crown, Play, Activity } from 'lucide-react';
import { generateMockAccounts } from '../services/gemini';
import { Account } from '../types';

interface GeneratorProps {
  onGenerate: (accounts: Account[]) => void;
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AX', name: 'Åland Islands' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AI', name: 'Anguilla' },
  { code: 'AQ', name: 'Antarctica' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BV', name: 'Bouvet Island' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IO', name: 'British Indian Ocean Territory' },
  { code: 'BN', name: 'Brunei Darussalam' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'KY', name: 'Cayman Islands' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CX', name: 'Christmas Island' },
  { code: 'CC', name: 'Cocos (Keeling) Islands' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo, The Democratic Republic of the' },
  { code: 'CK', name: 'Cook Islands' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: "Cote D'Ivoire" },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FK', name: 'Falkland Islands (Malvinas)' },
  { code: 'FO', name: 'Faroe Islands' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'GF', name: 'French Guiana' },
  { code: 'PF', name: 'French Polynesia' },
  { code: 'TF', name: 'French Southern Territories' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GR', name: 'Greece' },
  { code: 'GL', name: 'Greenland' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GP', name: 'Guadeloupe' },
  { code: 'GU', name: 'Guam' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GG', name: 'Guernsey' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HM', name: 'Heard Island and Mcdonald Islands' },
  { code: 'VA', name: 'Holy See (Vatican City State)' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran, Islamic Republic Of' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IM', name: 'Isle of Man' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JE', name: 'Jersey' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KP', name: "Korea, Democratic People's Republic of" },
  { code: 'KR', name: 'Korea, Republic of' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: "Lao People's Democratic Republic" },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libyan Arab Jamahiriya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MO', name: 'Macao' },
  { code: 'MK', name: 'Macedonia, The Former Yugoslav Republic of' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MQ', name: 'Martinique' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'YT', name: 'Mayotte' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia, Federated States of' },
  { code: 'MD', name: 'Moldova, Republic of' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'MS', name: 'Montserrat' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'AN', name: 'Netherlands Antilles' },
  { code: 'NC', name: 'New Caledonia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NU', name: 'Niue' },
  { code: 'NF', name: 'Norfolk Island' },
  { code: 'MP', name: 'Northern Mariana Islands' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PS', name: 'Palestinian Territory, Occupied' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PN', name: 'Pitcairn' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RE', name: 'Reunion' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russian Federation' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'SH', name: 'Saint Helena' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'PM', name: 'Saint Pierre and Miquelon' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'CS', name: 'Serbia and Montenegro' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SJ', name: 'Svalbard and Jan Mayen' },
  { code: 'SZ', name: 'Swaziland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syrian Arab Republic' },
  { code: 'TW', name: 'Taiwan, Province of China' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania, United Republic of' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TK', name: 'Tokelau' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TC', name: 'Turks and Caicos Islands' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'UM', name: 'United States Minor Outlying Islands' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Viet Nam' },
  { code: 'VG', name: 'Virgin Islands, British' },
  { code: 'VI', name: 'Virgin Islands, U.S.' },
  { code: 'WF', name: 'Wallis and Futuna' },
  { code: 'EH', name: 'Western Sahara' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' }
];

const PRODUCTS = [
  { id: 'netflix', name: 'Netflix', icon: Tv, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'disney', name: 'Disney+', icon: Crown, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'hulu', name: 'Hulu', icon: Play, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'nba', name: 'NBA LP', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'youtube', name: 'YouTube', icon: Video, color: 'text-red-600', bg: 'bg-red-600/10' },
  { id: 'dazn', name: 'DAZN', icon: Tv, color: 'text-white', bg: 'bg-white/10' },
  { id: 'spotify', name: 'Spotify', icon: Music, color: 'text-green-400', bg: 'bg-green-400/10' },
  { id: 'prime', name: 'Prime Video', icon: Video, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'shahid', name: 'Shahid VIP', icon: Crown, color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

const SERVICE_PLANS: Record<string, string[]> = {
  'Netflix': ['Basic (720p)', 'Standard (1080p)', 'Premium (4K UHD)'],
  'Disney+': ['Basic (With Ads)', 'Premium (No Ads)', 'Duo Basic (Disney+ & Hulu)', 'Duo Premium (Disney+ & Hulu)'],
  'Hulu': ['Hulu (With Ads)', 'Hulu (No Ads)', 'Hulu + Live TV'],
  'NBA LP': ['Team Pass', 'League Pass', 'League Pass Premium'],
  'YouTube': ['Individual', 'Family', 'Duo'],
  'DAZN': ['Monthly Saver', 'Flexible Pass', 'Annual Super Saver'],
  'Spotify': ['Individual', 'Duo', 'Family', 'Student'],
  'Prime Video': ['Prime Video Member', 'Amazon Prime (Full Benefits)'],
  'Shahid VIP': ['VIP Mobile', 'VIP', 'VIP Sport', 'VIP Ultimate'],
};

export const Generator: React.FC<GeneratorProps> = ({ onGenerate }) => {
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState('Netflix');
  const [region, setRegion] = useState('US');
  const [plan, setPlan] = useState(SERVICE_PLANS['Netflix'][2]); // Default to Premium (4K UHD)
  const [duration, setDuration] = useState('1 Month');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleServiceChange = (newService: string) => {
    setService(newService);
    const plans = SERVICE_PLANS[newService];
    if (plans && plans.length > 0) {
      setPlan(plans[0]);
    } else {
      setPlan('Premium');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setLoading(true);
    try {
      const accounts = await generateMockAccounts(quantity, region, plan, duration, service);
      onGenerate(accounts);
    } catch (err) {
      setError('Failed to generate accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center text-primary-500">
            <Zap size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Account Generator</h2>
            <p className="text-gray-400">Select a product and generate high-quality verified accounts.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-400">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-8">
          
          {/* Product Selection Grid */}
          <div className="space-y-3">
             <label className="text-sm font-medium text-gray-400">Select Service</label>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
               {PRODUCTS.map((prod) => (
                 <button
                   key={prod.id}
                   type="button"
                   onClick={() => handleServiceChange(prod.name)}
                   className={`
                     flex flex-col items-center justify-center p-4 rounded-xl border transition-all
                     ${service === prod.name 
                       ? 'bg-gray-800 border-primary-500 ring-1 ring-primary-500/50' 
                       : 'bg-gray-950 border-gray-800 hover:bg-gray-800 hover:border-gray-700'}
                   `}
                 >
                   <div className={`p-3 rounded-full mb-2 ${prod.bg} ${prod.color}`}>
                     <prod.icon size={24} />
                   </div>
                   <span className="text-sm font-medium text-gray-300">{prod.name}</span>
                 </button>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Target Region</label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-600 transition-colors"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Subscription Plan</label>
              <select 
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-600 transition-colors"
              >
                {SERVICE_PLANS[service]?.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Calendar size={14} /> Duration
              </label>
              <select 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-600 transition-colors"
              >
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Quantity (Max 10,000)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="1" 
                  max="10000" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <input 
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => {
                    const val = Math.min(10000, Math.max(1, parseInt(e.target.value) || 1));
                    setQuantity(val);
                  }}
                  className="w-24 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-center text-white font-mono focus:outline-none focus:border-primary-600"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-white">Total Cost</span>
              <span className="text-2xl font-bold text-green-500">Free (Unlimited Demo)</span>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all
                ${loading 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-lg shadow-primary-900/20'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Generating {quantity} Accounts...
                </>
              ) : (
                <>
                  <Zap size={24} />
                  Generate {quantity} Accounts
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              *By generating, you agree to the Terms of Service. Generated accounts are for testing purposes only.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};