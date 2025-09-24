import React, { useState } from 'react';
import { Settings, Globe, CreditCard, CheckCircle, XCircle, AlertCircle, Key, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'connected' | 'disconnected' | 'error';
  isEnabled: boolean;
  config?: Record<string, any>;
}

const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
    {
      id: 'booking',
      name: 'Booking.com',
      description: 'Conecta con Booking.com para sincronizar reservas automáticamente',
      icon: Globe,
      status: 'disconnected',
      isEnabled: false,
      config: {
        apiKey: '',
        propertyId: '',
        username: '',
        endpoint: 'https://distribution-xml.booking.com/xml'
      }
    },
    {
      id: 'dian',
      name: 'DIAN - Facturación Electrónica',
      description: 'Integración con DIAN para facturación electrónica y pruebas habilitantes',
      icon: CreditCard,
      status: 'disconnected',
      isEnabled: false,
      config: {
        nit: '',
        certificatePath: '',
        certificatePassword: '',
        environment: 'test', // test | production
        participateInTests: false
      }
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [configData, setConfigData] = useState<Record<string, any>>({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return CheckCircle;
      case 'error':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const handleConfigClick = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      setSelectedIntegration(integrationId);
      setConfigData(integration.config || {});
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfigData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveConfig = () => {
    if (!selectedIntegration) return;

    setIntegrations(prev => prev.map(integration => {
      if (integration.id === selectedIntegration) {
        return {
          ...integration,
          config: configData,
          status: 'connected',
          isEnabled: true
        };
      }
      return integration;
    }));

    toast.success('Configuración guardada exitosamente');
    setSelectedIntegration(null);
  };

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === integrationId) {
        const newEnabled = !integration.isEnabled;
        return {
          ...integration,
          isEnabled: newEnabled,
          status: newEnabled && integration.config ? 'connected' : 'disconnected'
        };
      }
      return integration;
    }));

    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      toast.success(`${integration.name} ${!integration.isEnabled ? 'activada' : 'desactivada'}`);
    }
  };

  const renderBookingConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          API Key de Booking.com
        </label>
        <input
          type="password"
          value={configData.apiKey || ''}
          onChange={(e) => handleConfigChange('apiKey', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ingresa tu API Key"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property ID
        </label>
        <input
          type="text"
          value={configData.propertyId || ''}
          onChange={(e) => handleConfigChange('propertyId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ID de tu propiedad en Booking.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Usuario
        </label>
        <input
          type="text"
          value={configData.username || ''}
          onChange={(e) => handleConfigChange('username', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tu usuario de Booking.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Endpoint API
        </label>
        <input
          type="url"
          value={configData.endpoint || ''}
          onChange={(e) => handleConfigChange('endpoint', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://distribution-xml.booking.com/xml"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">¿Cómo obtener las credenciales?</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Inicia sesión en tu cuenta de Booking.com Partner</li>
          <li>Ve a "Extranet" → "Configuración de la propiedad"</li>
          <li>Busca la sección "Conectividad" o "API"</li>
          <li>Genera una nueva API Key y copia el Property ID</li>
          <li>Configura los permisos necesarios para reservas</li>
        </ol>
      </div>
    </div>
  );

  const renderDianConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          NIT de la Empresa
        </label>
        <input
          type="text"
          value={configData.nit || ''}
          onChange={(e) => handleConfigChange('nit', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="123456789-0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ruta del Certificado Digital
        </label>
        <input
          type="text"
          value={configData.certificatePath || ''}
          onChange={(e) => handleConfigChange('certificatePath', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="/path/to/certificate.p12"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña del Certificado
        </label>
        <input
          type="password"
          value={configData.certificatePassword || ''}
          onChange={(e) => handleConfigChange('certificatePassword', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Contraseña del certificado"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ambiente
        </label>
        <select
          value={configData.environment || 'test'}
          onChange={(e) => handleConfigChange('environment', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="test">Pruebas</option>
          <option value="production">Producción</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="participateInTests"
          checked={configData.participateInTests || false}
          onChange={(e) => handleConfigChange('participateInTests', e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="participateInTests" className="text-sm font-medium text-gray-700">
          Participar en las pruebas habilitantes de la DIAN
        </label>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">Información sobre las Pruebas Habilitantes</h4>
        <p className="text-sm text-yellow-800 mb-2">
          Las pruebas habilitantes son obligatorias para poder facturar electrónicamente en Colombia.
        </p>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>Se requiere certificado digital válido</li>
          <li>Configuración en ambiente de pruebas primero</li>
          <li>Validación de casos de prueba específicos</li>
          <li>Aprobación por parte de la DIAN</li>
        </ul>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">Pasos para Habilitar</h4>
        <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
          <li>Obtén tu certificado digital de una CA autorizada</li>
          <li>Regístrate en el portal de la DIAN</li>
          <li>Configura el NIT y certificado en este sistema</li>
          <li>Ejecuta las pruebas habilitantes</li>
          <li>Espera la aprobación de la DIAN</li>
          <li>Cambia a ambiente de producción</li>
        </ol>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integraciones</h1>
            <p className="text-gray-600 mt-1">Conecta DiploManager con servicios externos</p>
          </div>
          <Settings className="text-gray-400" size={32} />
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const StatusIcon = getStatusIcon(integration.status);
          
          return (
            <div key={integration.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="text-gray-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <StatusIcon className={`${getStatusColor(integration.status)}`} size={16} />
                        <span className={`text-sm ${getStatusColor(integration.status)}`}>
                          {integration.status === 'connected' ? 'Conectado' : 
                           integration.status === 'error' ? 'Error' : 'Desconectado'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={integration.isEnabled}
                      onChange={() => toggleIntegration(integration.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{integration.description}</p>
                
                <button
                  onClick={() => handleConfigClick(integration.id)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Key size={16} />
                  <span>Configurar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Configurar {integrations.find(i => i.id === selectedIntegration)?.name}
                </h3>
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {selectedIntegration === 'booking' && renderBookingConfig()}
              {selectedIntegration === 'dian' && renderDianConfig()}
              
              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Save size={16} />
                  <span>Guardar Configuración</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Mock Documentation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Mock para Reservas Externas</h2>
        <p className="text-gray-600 mb-4">
          DiploManager incluye una API mock que permite recibir reservas de sistemas externos de manera simulada.
          Las reservas se generan automáticamente y aparecen en el dashboard y calendario.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Endpoint de Ejemplo</h3>
          <code className="text-sm text-gray-700 bg-white p-2 rounded border block mb-2">
            POST /api/v1/reservations/external
          </code>
          
          <h4 className="font-medium text-gray-900 mb-2 mt-4">Ejemplo de Payload:</h4>
          <pre className="text-sm text-gray-700 bg-white p-3 rounded border overflow-x-auto">
{`{
  "guestName": "Cliente Externo",
  "email": "cliente@ejemplo.com",
  "phone": "+57 300 123 4567",
  "roomNumber": "105",
  "roomType": "Suite Deluxe",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-18",
  "guests": 2,
  "totalAmount": 300000,
  "specialRequests": "Vista al mar"
}`}
          </pre>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Nota:</strong> La API mock genera reservas automáticamente cada 30 segundos con una probabilidad del 30%. 
            Estas reservas aparecen marcadas como "API Externa\" en el sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Integrations;