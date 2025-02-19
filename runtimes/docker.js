const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

class DockerManager {

    static runPrivilegedCommand(command, callback) {
        if (process.platform === 'linux') {
            // Linux: Use pkexec for GUI password prompt
            exec(`pkexec ${command}`, (error, stdout, stderr) => {
                callback(error, stdout, stderr);
            });
        } else if (process.platform === 'darwin') {
            // macOS: Use osascript elevation
            exec(`osascript -e 'do shell script "${command}" with administrator privileges'`, 
                callback);
        } else if (process.platform === 'win32') {
            // Windows: Execute normally as the script handles elevation internally
            exec(command, callback);
        }
    }

    static async getScriptPath(scriptName) {
        const scriptsPath = path.join(__dirname, 'scripts');
        const scriptPath = path.join(scriptsPath, scriptName);
        
        try {
            // Only handle ASAR unpacking and permissions for Linux
            if (process.platform === 'linux' || process.platform === 'win32') {
                // Check if we're running from an ASAR archive
                const isAsar = scriptPath.includes('app.asar');
                const finalPath = isAsar ? scriptPath.replace('app.asar', 'app.asar.unpacked') : scriptPath;
                
                try {
                    await fs.chmod(finalPath, '755');
                } catch (error) {
                    console.warn(`Warning: Could not set executable permissions on ${finalPath}`, error);
                    // Continue execution as the file might already be executable
                }
                
                // Verify the script exists
                await fs.access(finalPath);
                return finalPath;
            }
            
            // For Windows and macOS, just return the direct path
            return scriptPath;
        } catch (error) {
            console.error(`Failed to prepare script ${scriptName}:`, error);
            throw new Error(`Script not found: ${scriptName}. Make sure all required files are included in your project.`);
        }
    }

    static async getInstallScript() {
        const scriptName = (() => {
            switch (process.platform) {
                case 'win32': return 'docker_install_win.bat';
                case 'darwin': return 'docker_install_macos.sh';
                case 'linux': return 'docker_install_linux.sh';
                default: throw new Error('Unsupported platform');
            }
        })();
        
        return this.getScriptPath(scriptName);
    }

    static async getDockerCheckScript() {
        const scriptName = (() => {
            switch (process.platform) {
                case 'win32': return 'docker_check_win.bat';
                case 'darwin': return 'docker_check_macos.sh';
                case 'linux': return 'docker_check_linux.sh';
                default: throw new Error('Unsupported platform');
            }
        })();
        
        return this.getScriptPath(scriptName);
    }

    // Check if Docker is installed
    static async checkInstallation() {
        try {
            const scriptPath = await this.getDockerCheckScript();
            let installed = false;
            let running = false;

            return new Promise((resolve, reject) => {
                const command = process.platform === 'win32'
                    ? scriptPath
                    : `sh "${scriptPath}"`;

                const proc = exec(command, (error, stdout, stderr) => {
                    if (error) {
                        reject(new Error(`Docker check failed: ${error.message}`));
                        return;
                    }
                    console.log('Docker check output:', stdout);
                    const lines = stdout.trim().split('\n');

                    lines.forEach(line => {
                        line = line.trim();
                        if (line === 'NOT INSTALLED') {
                            installed = false;
                            running = false;
                        } else if (line === 'NOT RUNNING') {
                            installed = true;
                            running = false;
                        } else if (line === 'RUNNING') {
                            installed = true;
                            running = true;
                        }
                    });

                    console.log('Docker status:', { installed, running });
                    resolve({ installed, running });
                });

                // Log real-time output
                proc.stdout.on('data', (data) => {
                    console.log('Docker check output:', data);
                    const lines = data.toString().split('\n');
                    lines.forEach(line => {
                        line = line.trim();
                        if (line === 'NOT INSTALLED') {
                            installed = false;
                            running = false;
                        } else if (line === 'NOT RUNNING') {
                            installed = true;
                            running = false;
                        } else if (line === 'RUNNING') {
                            installed = true;
                            running = true;
                        }
                    });
                });

                proc.on('close', (code) => {
                    console.log('Docker status:', { installed, running });
                    resolve({ installed, running });
                });
            });
        } catch (error) {
            throw new Error(`Failed to execute Docker check script: ${error.message}`);
        }
    }

    // Install Docker using platform-specific scripts
    static async installDocker() {
        try {
            const scriptPath = await this.getInstallScript();

            return new Promise((resolve, reject) => {
                const command = process.platform === 'win32'
                    ? scriptPath
                    : `sh "${scriptPath}"`;

                this.runPrivilegedCommand(command, (error, stdout, stderr) => {
                    if (error) {
                        reject(new Error(`Docker installation failed: ${error.message}`));
                        return;
                    }
                    console.log('Installation output:', stdout);
                    if (stderr) console.error('Installation warnings:', stderr);
                    resolve(true);
                });
            });
        } catch (error) {
            throw new Error(`Failed to execute installation script: ${error.message}`);
        }
    }

    // Check Docker service status
    static checkServiceStatus() {
        return new Promise((resolve) => {
            const command = process.platform === 'win32'
                ? 'docker info'
                : 'systemctl is-active docker';

            exec(command, (error) => {
                resolve(!error);
            });
        });
    }

    // Get Docker version info
    static getVersionInfo() {
        return new Promise((resolve, reject) => {
            exec('docker version --format json', (error, stdout) => {
                if (error) {
                    reject(new Error('Failed to get Docker version'));
                    return;
                }
                try {
                    resolve(JSON.parse(stdout));
                } catch (e) {
                    reject(new Error('Failed to parse Docker version info'));
                }
            });
        });
    }


}

module.exports = DockerManager; 